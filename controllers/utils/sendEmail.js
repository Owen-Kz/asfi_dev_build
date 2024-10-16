const { configDotenv } = require('dotenv');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const client = SibApiV3Sdk.ApiClient.instance;


// Configure API key authorization
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API;

const sendEmail = async (useremail, subject, message) => {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();


        try {
            async function SendMain(email) {
                const response = await apiInstance.sendTransacEmail(email);
                console.log("Brevo Response:", response);
                return true
            }
            const messageHtml = `${message}`
    
                const email = {
                    to: [{ email: useremail }],
                    sender: { email: 'support@asfischolar.net', name: 'ASFI Scholar' },
                    subject:subject,
                    htmlContent: `<html><body>${messageHtml}
                                 </body></html>`
                };
                await SendMain(email);

        } catch (error) {
            console.log("Error sending email:", error);
            return false
           
        }

};

module.exports = sendEmail;
