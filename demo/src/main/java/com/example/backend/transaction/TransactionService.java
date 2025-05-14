package com.example.backend.transaction;

import com.example.backend.auth.SecurityUtils;
import com.example.backend.category.Category;
import com.example.backend.category.CategoryRepository;
import com.example.backend.groupingrules.GroupingRules;
import com.example.backend.groupingrules.GroupingRulesRepository;
import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReaderBuilder;
import org.springframework.stereotype.Service;
import com.opencsv.CSVReader;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final SecurityUtils securityUtils;
    private final GroupingRulesRepository groupingRulesRepository;

    public TransactionService(TransactionRepository transactionRepository, CategoryRepository categoryRepository, SecurityUtils securityUtils, GroupingRulesRepository groupingRulesRepository) {
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
        this.securityUtils = securityUtils;
        this.groupingRulesRepository = groupingRulesRepository;
    }

    public TransactionDTO addTransaction(TransactionDTO transactionDTO) {
        // Find existing category by name (ignoring userId)
        Category category = categoryRepository.findByName(transactionDTO.categoryName())
                .orElseGet(() -> {
                    // Create a new category if it doesn't exist
                    Category newCategory = new Category();
                    newCategory.setName(transactionDTO.categoryName());
                    newCategory.setGlobal(true); // Mark as global for shared usage
                    return categoryRepository.save(newCategory);
                });

        TransactionType transactionType = transactionDTO.amount().compareTo(BigDecimal.ZERO) < 0
                ? TransactionType.EXPENSE
                : TransactionType.INCOME;

        // Build the transaction
        Transaction transaction = Transaction.builder()
                .userId(securityUtils.getAuthenticatedUserId()) // Keep userId for tracking
                .transactionType(transactionType)
                .amount(transactionDTO.amount())
                .transactionDate(transactionDTO.transactionDate())
                .category(category)
                .description(transactionDTO.description())
                .build();

        // Save the transaction
        Transaction savedTransaction = transactionRepository.save(transaction);

        // Convert the saved transaction back to DTO with the ID
        return new TransactionDTO(
                savedTransaction.getId(),
                savedTransaction.getTransactionType(),
                savedTransaction.getAmount(),
                savedTransaction.getTransactionDate(),
                savedTransaction.getCategory().getName(),
                savedTransaction.getDescription()
        );
    }

    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }

    public void updateTransaction(Long id, TransactionDTO transactionDTO) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (transactionDTO.categoryName() != null) {
            Category category = categoryRepository.findByName(transactionDTO.categoryName())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            transaction.setCategory(category);
        }

        if (transactionDTO.amount() != null) {
            transaction.setAmount(transactionDTO.amount());
        }

        if (transactionDTO.transactionDate() != null) {
            transaction.setTransactionDate(transactionDTO.transactionDate());
        }

        if (transactionDTO.description() != null) {
            transaction.setDescription(transactionDTO.description());
        }

        transactionRepository.save(transaction);
    }
    public List<TransactionDTO> getAllUserTransactions() {
        Long userId = securityUtils.getAuthenticatedUserId();
        return transactionRepository.findAll().stream()
                .filter(transaction -> transaction.getUserId() != null && transaction.getUserId().equals(userId)) // Add null check
                .map(transaction -> new TransactionDTO(
                        transaction.getId(),
                        transaction.getTransactionType(),
                        transaction.getAmount(),
                        transaction.getTransactionDate(),
                        transaction.getCategory().getName(),
                        transaction.getDescription()
                ))
                .collect(Collectors.toList());
    }

    public List<TransactionDTO> getAllUserExpenses() {
        Long userId = securityUtils.getAuthenticatedUserId();
        return transactionRepository.findAll().stream()
                .filter(transaction -> transaction.getUserId() != null && transaction.getUserId().equals(userId)) // Add null check
                .filter(transaction -> transaction.getTransactionType() == TransactionType.EXPENSE)
                .map(transaction -> new TransactionDTO(
                        transaction.getId(),
                        transaction.getTransactionType(),
                        transaction.getAmount(),
                        transaction.getTransactionDate(),
                        transaction.getCategory().getName(),
                        transaction.getDescription()
                ))
                .collect(Collectors.toList());
    }

    public List<TransactionDTO> getAllUserIncomes() {
        Long userId = securityUtils.getAuthenticatedUserId();
        return transactionRepository.findAll().stream()
                .filter(transaction -> transaction.getUserId() != null && transaction.getUserId().equals(userId)) // Add null check
                .filter(transaction -> transaction.getTransactionType() == TransactionType.INCOME)
                .map(transaction -> new TransactionDTO(
                        transaction.getId(),
                        transaction.getTransactionType(),
                        transaction.getAmount(),
                        transaction.getTransactionDate(),
                        transaction.getCategory().getName(),
                        transaction.getDescription()
                ))
                .collect(Collectors.toList());
    }

    public List<MonthlyIncomeDTO> getAllUserIncomesByMonth() {
        Long userId = securityUtils.getAuthenticatedUserId();
        return transactionRepository.findAll().stream()
                .filter(transaction -> transaction.getUserId() != null && transaction.getUserId().equals(userId))
                .filter(transaction -> transaction.getTransactionType() == TransactionType.INCOME)
                .collect(Collectors.groupingBy(transaction -> transaction.getTransactionDate().getMonthValue()))
                .entrySet()
                .stream()
                .map(entry -> new MonthlyIncomeDTO(
                        entry.getKey(), // Month number
                        entry.getValue().stream()
                                .map(Transaction::getAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add)
                ))
                .collect(Collectors.toList());
    }

    public List<MonthlyExpenseDTO> getAllUserExpensesByMonth() {
        Long userId = securityUtils.getAuthenticatedUserId();
        return transactionRepository.findAll().stream()
                .filter(transaction -> transaction.getUserId() != null && transaction.getUserId().equals(userId))
                .filter(transaction -> transaction.getTransactionType() == TransactionType.EXPENSE)
                .collect(Collectors.groupingBy(transaction -> transaction.getTransactionDate().getMonthValue()))
                .entrySet()
                .stream()
                .map(entry -> new MonthlyExpenseDTO(
                        entry.getKey(),
                        entry.getValue().stream()
                                .map(Transaction::getAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add)
                ))
                .collect(Collectors.toList());
    }
    public List<MonthlySummaryDTO> getAllUserMonthlySummary() {
        Long userId = securityUtils.getAuthenticatedUserId();

        Map<Integer, BigDecimal> incomesByMonth = transactionRepository.findAll().stream()
                .filter(transaction -> transaction.getUserId() != null && transaction.getUserId().equals(userId))
                .filter(transaction -> transaction.getTransactionType() == TransactionType.INCOME)
                .collect(Collectors.groupingBy(
                        transaction -> transaction.getTransactionDate().getMonthValue(),
                        Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)
                ));

        Map<Integer, BigDecimal> expensesByMonth = transactionRepository.findAll().stream()
                .filter(transaction -> transaction.getUserId() != null && transaction.getUserId().equals(userId))
                .filter(transaction -> transaction.getTransactionType() == TransactionType.EXPENSE)
                .collect(Collectors.groupingBy(
                        transaction -> transaction.getTransactionDate().getMonthValue(),
                        Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)
                ));

        return Stream.concat(incomesByMonth.keySet().stream(), expensesByMonth.keySet().stream())
                .distinct()
                .map(month -> new MonthlySummaryDTO(
                        month,
                        incomesByMonth.getOrDefault(month, BigDecimal.ZERO),
                        expensesByMonth.getOrDefault(month, BigDecimal.ZERO)
                ))
                .sorted(Comparator.comparingInt(MonthlySummaryDTO::month))
                .collect(Collectors.toList());
    }


    public void importTransactionsFromCsv(MultipartFile file) throws Exception {
        try (CSVReader csvReader = new CSVReaderBuilder(new InputStreamReader(file.getInputStream()))
                .withCSVParser(new CSVParserBuilder().withSeparator(';').build())
                .build()) {
            String[] headers = csvReader.readNext(); // Skip the header row
            String[] line;

            List<Transaction> transactions = new ArrayList<>();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
            Long userId = securityUtils.getAuthenticatedUserId();

            while ((line = csvReader.readNext()) != null) {
                // Check if the row has enough columns
                if (line.length < 9) {
                    System.err.println("Skipping malformed row: " + String.join(";", line));
                    continue;
                }
                String debitOrCredit = line[7]; // "Deebet/Kreedit (D/C)"
                TransactionType transactionType;
                String rawAmount = line[8].replace(",", ".").trim(); // Clean up the value
                BigDecimal amount;
                try {
                    amount = new BigDecimal(rawAmount);
                } catch (NumberFormatException e) {
                    System.err.println("Invalid amount format: " + rawAmount);
                    continue; // Skip this row if the amount is invalid
                }
                if ("D".equalsIgnoreCase(debitOrCredit)) {
                    transactionType = TransactionType.EXPENSE;
                    amount = amount.negate(); // Make the amount negative for expenses
                } else {
                    transactionType = TransactionType.INCOME;
                }

                // Determine the category name
                String description = line[4];
                Category category = findCategoryByGroupingRules(description, userId);

                if (category == null) {
                    String categoryName = "C".equalsIgnoreCase(debitOrCredit) ? "Makse" : description;
                    category = categoryRepository.findByName(categoryName)
                            .orElseGet(() -> {
                                Category newCategory = new Category();
                                newCategory.setName(categoryName);
                                newCategory.setUserId(userId);
                                newCategory.setGlobal(false);
                                return categoryRepository.save(newCategory);
                            });
                }

                // Create the transaction
                Transaction transaction = new Transaction();
                transaction.setTransactionType(transactionType);
                transaction.setAmount(amount);
                transaction.setCategory(category);
                transaction.setTransactionDate(LocalDate.parse(line[2].replace("\"", ""), formatter)); // "Kuupäev"
                transaction.setUserId(userId);
                transactions.add(transaction);
            }

            transactionRepository.saveAll(transactions);
        }
    }

    private Category findCategoryByGroupingRules(String description, Long userId) {
        List<GroupingRules> activeRules = groupingRulesRepository.findByUserIdAndIsActive(userId, true);
        for (GroupingRules rule : activeRules) {
            if (description.toLowerCase().contains(rule.getCriterion().toLowerCase())) {
                return rule.getCategory();
            }
        }
        return null;
    }
}