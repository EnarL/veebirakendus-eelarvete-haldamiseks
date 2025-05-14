package com.example.backend.transaction;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/transaction")
public class TransactionController {
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping()
    public ResponseEntity<List<TransactionDTO>> getAllUserTransactions() {
        return ResponseEntity.ok(transactionService.getAllUserTransactions());
    }
    @GetMapping("/expenses")
    public ResponseEntity<List<TransactionDTO>> getAllUserExpenses() {
        return ResponseEntity.ok(transactionService.getAllUserExpenses());
    }
    @GetMapping("/incomes")
    public ResponseEntity<List<TransactionDTO>> getAllUserIncomes() {
        return ResponseEntity.ok(transactionService.getAllUserIncomes());
    }
    @GetMapping("/incomesByMonth")
    public ResponseEntity<List<MonthlyIncomeDTO>> getAllUserIncomesByMonth() {
        return ResponseEntity.ok(transactionService.getAllUserIncomesByMonth());
    }
    @GetMapping("/expensesByMonth")
    public ResponseEntity<List<MonthlyExpenseDTO>> getAllUserExpensesByMonth() {
        return ResponseEntity.ok(transactionService.getAllUserExpensesByMonth());
    }
    @GetMapping("/monthlySummary")
    public ResponseEntity<List<MonthlySummaryDTO>> getAllUserMonthlySummary() {
        return ResponseEntity.ok(transactionService.getAllUserMonthlySummary());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }
    @PostMapping
    public ResponseEntity<TransactionDTO> createTransaction(@RequestBody TransactionDTO transactionDTO) {
        TransactionDTO createdTransaction = transactionService.addTransaction(transactionDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdTransaction);
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTransaction(@PathVariable Long id, @RequestBody TransactionDTO transactionDTO) {
         transactionService.updateTransaction(id, transactionDTO);
         return ResponseEntity.noContent().build();
    }
    @PostMapping("/import")
    public ResponseEntity<String> importTransactions(@RequestParam("file") MultipartFile file) {
        try {
            transactionService.importTransactionsFromCsv(file);
            return ResponseEntity.ok("Transactions imported successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to import transactions: " + e.getMessage());
        }
    }



}