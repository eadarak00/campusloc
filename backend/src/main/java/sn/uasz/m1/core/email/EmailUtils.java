package sn.uasz.m1.core.email;

public class EmailUtils {

    public static String sujetValidationInscription() {
        return "Validation de votre compte CampusLoc";
    }

    public static String corpsValidationInscriptionHTML(String nom, String code) {
        return String.format("""
                <html>
                <head>
                  <style>
                    body {
                      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                      background-color: #fdf6e3; /* beige doux */
                      margin: 0;
                      padding: 20px;
                      color: #5d4037; /* brun doux */
                    }
                    .container {
                      background-color: #fffaf0;
                      padding: 30px;
                      border-radius: 12px;
                      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                      max-width: 600px;
                      margin: auto;
                      border: 1px solid #e0d7c6;
                    }
                    h2 {
                      color: #6d4c41;
                      margin-top: 0;
                    }
                    p {
                      font-size: 16px;
                      line-height: 1.6;
                    }
                    .code {
                      font-size: 30px;
                      font-weight: bold;
                      color: #d35400;
                      background-color: #fbe9e7;
                      padding: 10px 20px;
                      display: inline-block;
                      border-radius: 8px;
                      margin: 20px 0;
                      letter-spacing: 2px;
                    }
                    small {
                      color: #8d6e63;
                      font-size: 13px;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <h2>Bonjour %s,</h2>
                    <p>Merci de vous être inscrit sur <strong>CampusLoc</strong> 🤝</p>
                    <p>Voici votre <strong>code de validation</strong> :</p>
                    <div class="code">%s</div>
                    <p><small>Ce code expire dans 15 minutes.</small></p>
                    <br>
                    <p>— L'équipe CampusLoc</p>
                  </div>
                </body>
                </html>
                """, nom, code);
    }

}