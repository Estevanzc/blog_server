const emailPage = (userName, resetLink) => {
    const currentYear = new Date().getFullYear();

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        /* Responsive Styles (Mobile Clients) 
           These work in Gmail App, iOS Mail, etc.
        */
        @media screen and (max-width: 600px) {
            .content-table {
                width: 100% !important;
                border-radius: 0 !important;
            }
            .wrapper-table {
                padding: 0 !important;
            }
            .hero-header {
                height: 120px !important;
            }
            .card-content {
                padding: 30px 20px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F3F4F6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased; font-size: 16px; line-height: 1.6; color: #374151;">
    
    <!-- Outer Wrapper -->
    <table class="wrapper-table" role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F3F4F6; padding: 40px 0;">
        <tr>
            <td align="center">
                
                <!-- Main Content Card -->
                <table class="content-table" role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); overflow: hidden; border-collapse: separate;">
                    
                    <!-- Decorative Header / Brand Strip -->
                    <tr>
                        <td class="hero-header" align="center" style="background-color: #5bc0be; padding: 30px 0; height: 100px; vertical-align: middle;">
                             <!-- Optional: Place Logo Here in White -->
                             <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">Wisely Assistance</h1>
                        </td>
                    </tr>

                    <!-- Card Body -->
                    <tr>
                        <td class="card-content" style="padding: 40px 50px;">
                            
                            <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827; text-align: center;">
                                Forgot your password?
                            </h2>

                            <p style="margin: 0 0 20px 0; color: #4B5563; text-align: center;">
                                Hi <strong>${userName}</strong>,
                            </p>
                            
                            <p style="margin: 0 0 30px 0; color: #4B5563; text-align: center;">
                                That's okay, it happens! Click the button below to reset your password and get back into your account.
                            </p>
                            
                            <!-- Call to Action Button -->
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <a href="${resetLink}" target="_blank" style="background-color: #5bc0be; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 16px 32px; border-radius: 8px; display: inline-block; box-shadow: 0 4px 6px rgba(79, 70, 229, 0.2); transition: background-color 0.2s;">
                                            <!--[if mso]>
                                            <i style="letter-spacing: 25px; mso-font-width: -100%; mso-text-raise: 30pt">&nbsp;</i>
                                            <![endif]-->
                                            <span style="mso-text-raise: 15pt;">Reset My Password</span>
                                            <!--[if mso]>
                                            <i style="letter-spacing: 25px; mso-font-width: -100%">&nbsp;</i>
                                            <![endif]-->
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 30px 0 0 0; font-size: 14px; color: #6B7280; text-align: center;">
                                If you didn't request a password reset, you can safely ignore this email.
                            </p>

                            <!-- Divider -->
                            <hr style="border: 0; border-top: 1px solid #E5E7EB; margin: 30px 0;" />

                            <!-- Fallback Link -->
                            <p style="margin: 0; font-size: 12px; color: #9CA3AF; text-align: center; line-height: 1.5;">
                                If the button doesn't work, copy and paste this link into your browser:<br/>
                                <a href="${resetLink}" style="color: #5bc0be; text-decoration: underline; word-break: break-all;">${resetLink}</a>
                            </p>
                        </td>
                    </tr>
                </table>

                <!-- Footer -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="center" style="padding: 30px 0 10px 0;">
                            <p style="margin: 0; font-size: 12px; color: #9CA3AF;">
                                &copy; ${currentYear} Wisely Assistance Inc.
                            </p>
                            <p style="margin: 8px 0 0 0; font-size: 12px; color: #9CA3AF;">
                                123 Business St, Tech City, TC 90210
                            </p>
                        </td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>
</body>
</html>
  `;
};

module.exports = { emailPage };