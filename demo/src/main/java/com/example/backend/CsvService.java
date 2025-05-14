package com.example.backend;


import com.example.backend.transaction.Transaction;
import com.example.backend.transaction.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class CsvService {

    private final TransactionRepository transactionRepository;

    public CsvService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public void saveTransactions(MultipartFile file) {
        try (BufferedReader fileReader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8));
             CSVParser csvParser = new CSVParser(fileReader, CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim())) {

            List<Transaction> transactions = new ArrayList<>();
            Iterable<CSVRecord> csvRecords = csvParser.getRecords();

            for (CSVRecord csvRecord : csvRecords) {
                Transaction transaction = new Transaction();
                transaction.setDescription(csvRecord.get("Description"));
                transaction.setAmount(BigDecimal.valueOf(Double.parseDouble(csvRecord.get("Amount"))));
                transaction.setTransactionDate(LocalDate.parse(csvRecord.get("Date")));
                transactions.add(transaction);
            }

            transactionRepository.saveAll(transactions);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse CSV file: " + e.getMessage());
        }
    }
}