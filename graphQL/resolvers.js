// resolvers.js
const db = require('../config/database');
const nodemailer = require('nodemailer');

const resolvers = {
    Query: {
        hello: () => 'Greetings from the Himalayas!',

        reviews: async () => {
            return new Promise((resolve, reject) => {
                db.query('SELECT * FROM tbl_Reviews', (err, results) => {
                    if (err) {
                        console.error('DB error:', err);
                        return reject(err);
                    }
                    resolve(results);
                });
            });
        },
    },

    Mutation: {
        bookAdventure: async (_, { input }) => {
            const {
                fullName,
                email,
                phone,
                country,
                activities,
                startDate,
                endDate,
                preferredTime,
                participants,
                specialRequirements,
            } = input;

            try {
                // (a) Create a transporter. In production, do NOT hardcode—use environment variables or a secrets manager.
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'amgainaditya@gmail.com',
                        pass: 'ehdr pvll urvs bpai',
                    },//ehdr pvll urvs bpai


                });

                // (b) Build the email HTML body
                const activityList = activities.join(', ');
                // Inside your Mutation resolver (nodemailer.sendMail), replace htmlBody with the following:

                const htmlBody = `<!DOCTYPE html>
                <html>
                <head>
                <meta charset="UTF-8">
                    <title>Booking Confirmation</title>
                <style>
                    /* Base Styles */
                    body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Helvetica Neue', Arial, sans-serif;
                    color: #333333;
                    line-height: 1.6;
                    background-color: #f7f9fc;
                }
                    table {
                    border-collapse: collapse;
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                }
                    img {
                    border: 0;
                    height: auto;
                    line-height: 100%;
                    outline: none;
                    text-decoration: none;
                    display: block;
                    max-width: 100%;
                }

                    /* Main Wrapper */
                    .wrapper {
                    width: 100%;
                    table-layout: fixed;
                    background-color: #f7f9fc;
                    padding: 40px 0;
                }
                    .main {
                    background-color: #ffffff;
                    margin: 0 auto;
                    width: 100%;
                    max-width: 600px;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                }

                    /* Header */
                    .header {
                    background: linear-gradient(135deg, #00796b 0%, #004d40 100%);
                    text-align: center;
                    padding: 30px 20px;
                }
                    .header img {
                    height: 50px;
                    display: inline-block;
                }

                    /* Hero Section */
                    .hero {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                }

                    /* Content */
                    .content {
                    padding: 40px;
                    font-family: 'Helvetica Neue', Arial, sans-serif;
                }
                    .greeting {
                    font-size: 24px;
                    font-weight: 600;
                    color: #004d40;
                    margin-bottom: 20px;
                }
                    .intro-text {
                    font-size: 16px;
                    margin-bottom: 25px;
                }

                    /* Details Table */
                    .details-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                    margin: 25px 0;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                }
                    .details-table th {
                    background-color: #00796b;
                    color: #ffffff;
                    font-weight: 500;
                    padding: 15px;
                    text-align: left;
                    font-size: 14px;
                }
                    .details-table td {
                    padding: 15px;
                    border-bottom: 1px solid #f0f0f0;
                    font-size: 14px;
                }
                    .details-table tr:last-child td {
                    border-bottom: none;
                }
                    .details-table tr:nth-child(even) {
                    background-color: #f9f9f9;
                }

                    /* CTA Button */
                    .cta-button {
                    display: inline-block;
                    padding: 14px 30px;
                    margin: 25px 0;
                    font-size: 16px;
                    color: #ffffff !important;
                    background: linear-gradient(135deg, #00796b 0%, #004d40 100%);
                    border-radius: 6px;
                    font-weight: 500;
                    text-decoration: none;
                    text-align: center;
                    box-shadow: 0 4px 12px rgba(0, 77, 64, 0.2);
                    transition: all 0.3s ease;
                }
                    .cta-button:hover {
                    background: linear-gradient(135deg, #00695c 0%, #003d33 100%);
                    box-shadow: 0 6px 16px rgba(0, 77, 64, 0.3);
                    transform: translateY(-2px);
                }

                    /* Footer */
                    .footer {
                    background-color: #f5f5f5;
                    text-align: center;
                    padding: 30px 40px;
                    font-size: 13px;
                    color: #666666;
                }
                    .footer-logo {
                    height: 40px;
                    margin-bottom: 15px;
                }
                    .contact-info {
                    margin-bottom: 15px;
                    line-height: 1.6;
                }
                    .copyright {
                    font-size: 12px;
                    color: #999999;
                    margin-top: 15px;
                }
                </style>
            </head>
                <body>
                <center class="wrapper">
                    <table class="main" width="100%" cellpadding="0" cellspacing="0">
                        <!-- HEADER -->
                        <tr>
                            <td class="header">
                                <img src="../public/site-images/logo.png" alt="Chitwan Adventures Logo" />
                                <h1 style="color: white; margin-top: 15px; font-size: 20px; font-weight: 300;">Adventure Awaits in the Heart of Nepal</h1>
                            </td>
                        </tr>

                        <!-- HERO IMAGE -->
                        <tr>
                            <td>
                                <img
                                    class="hero"
                                    src="https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?ixlib=rb-4.1.0&auto=format&fit=crop&w=600&q=80"
                                    alt="Chitwan National Park"
                                />
                            </td>
                        </tr>

                        <!-- EMAIL BODY -->
                        <tr>
                            <td class="content">
                                <p class="greeting">Namaste, ${fullName}!</p>
                                <p class="intro-text">
                                    Thank you for choosing <strong style="color: #00796b;">Chitwan Adventures</strong> for your upcoming journey.
                                    We're thrilled to be part of your Nepalese experience. Below are the details of your booking:
                                </p>

                                <!-- BOOKING SUMMARY TABLE -->
                                <table class="details-table">
                                    <tr>
                                        <th>Booking Details</th>
                                        <th></th>
                                    </tr>
                                    <tr>
                                        <td><strong>Full Name</strong></td>
                                        <td>${fullName}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Email</strong></td>
                                        <td>${email}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Phone</strong></td>
                                        <td>${phone}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Country</strong></td>
                                        <td>${country}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Activities</strong></td>
                                        <td>${activities.join(', ')}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Travel Dates</strong></td>
                                        <td>${startDate} to ${endDate}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Preferred Time</strong></td>
                                        <td>${preferredTime.charAt(0).toUpperCase() + preferredTime.slice(1)}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Participants</strong></td>
                                        <td>${participants}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Special Requirements</strong></td>
                                        <td>${specialRequirements || 'None specified'}</td>
                                    </tr>
                                </table>

                                <p style="margin-top: 25px;">
                                    Our adventure specialists will contact you within 24 hours to confirm your itinerary and
                                    provide payment details. For immediate assistance, please call us at +977-56-XXXXXX.
                                </p>

                                <!-- CALL-TO-ACTION BUTTON -->
                                <p style="text-align: center; margin: 30px 0;">
                                    <a href="https://nawalpurtourism.com/activities" class="cta-button" target="_blank">
                                        Explore More Adventures
                                    </a>
                                </p>

                                <p style="font-style: italic; color: #666;">
                                    "The journey of a thousand miles begins with a single step."<br>
                                    <span style="font-style: normal; font-weight: 500;">We can't wait to welcome you to Nepal!</span>
                                </p>
                            </td>
                        </tr>

                        <!-- FOOTER -->
                        <tr>
                            <td class="footer">
                                <img src="https://i.ibb.co/0jQ5J2T/chitwan-adventures-logo.png" class="footer-logo" alt="Chitwan Adventures Logo">

                                    <div class="contact-info">
                                        <strong>Chitwan Adventures Pvt. Ltd.</strong><br>
                                        Sauraha, Chitwan, Nepal<br>
                                        Phone: +977-56-XXXXXX<br>
                                        Email: <a href="mailto:info@chitwanadventures.com" style="color: #00796b; text-decoration: none;">info@chitwanadventures.com</a>
                                    </div>

                                    <div class="copyright">
                                        © ${new Date().getFullYear()} Chitwan Adventures. All rights reserved.<br>
                                        <a href="#" style="color: #999; text-decoration: none;">Privacy Policy</a> |
                                        <a href="#" style="color: #999; text-decoration: none;">Terms of Service</a>
                                    </div>
                            </td>
                        </tr>
                    </table>
                </center>
                </body>
            </html>
`

                // (c) Set up mail options
                const mailOptions = {
                    from: 'your.email@gmail.com',   // sender address (must match transporter.auth.user)
                    to: email,                      // recipient (the user who booked)
                    subject: 'Your Chitwan Adventures Booking Confirmation',
                    html: htmlBody,
                };

                // (d) Send the email
                await transporter.sendMail(mailOptions);
                console.log('Confirmation email sent to:', email);

                return {
                    success: true,
                    message: 'Booking successful and confirmation email sent.',
                };
            } catch (err) {
                console.error('Error sending confirmation email:', err);
                return {
                    success: false,
                    message: 'Booking failed. Could not send confirmation email.',
                };
            }
        },
    },
};

module.exports = resolvers;
