package com.example.backend.email;

import org.springframework.stereotype.Service;

@Service
public class EmailTemplate {

    public String buildInviteEmail(String kutsujaNimi, String eelarveNimi, String liitumisLink) {
        return """
                <html>
                <body>
                    <h2>Kutse liituda eelarvega</h2>
                    <p>Tere,</p>
                    <p><strong>%s</strong> on kutsunud sind liituma eelarvega <strong>%s</strong>.</p>
                    <p>Liitumiseks klõpsa alloleval lingil:</p>
                    <a href="%s" style="color: #1a73e8; text-decoration: none;">Liitu eelarvega</a>
 
                </body>
                </html>
                """.formatted(kutsujaNimi, eelarveNimi, liitumisLink);
    }
}