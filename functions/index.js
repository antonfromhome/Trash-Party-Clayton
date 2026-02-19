const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();

// Set your SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// This function triggers when a new email signup is added to Firestore
exports.sendWelcomeEmail = onDocumentCreated('emailSignups/{signupId}', async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    console.log("No data associated with the event");
    return;
  }

  const newSignup = snapshot.data();
  const email = newSignup.email;

  const msg = {
    to: email,
    from: 'hello-trash@trashparty.org',
    subject: 'Welcome to Trash Party!',
    text: `Hey there!

Thanks for your interest in Trash Party! We're stoked to have you as part of our community effort to keep Clayton clean.

Here's what happens next:
- Head outside whenever you feel like it (solo or with a neighbor)
- Pick up some litter while you walk around
- Log your cleanup on the map at trashparty.org
- Feel good knowing you made a difference

No meetings, no formal commitments—just neighbors helping neighbors make Clayton a little less trashy.

We'll send you occasional updates about community cleanup efforts, but we promise not to clog your inbox.

Thanks Neighbor!`,
    html: `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2d5016; font-size: 28px; margin-bottom: 10px;">Welcome to Trash Party!</h1>
        
        <p style="font-size: 16px; line-height: 1.6; color: #333;">Hey there!</p>
        
        <p style="font-size: 16px; line-height: 1.6; color: #333;">Thanks for your interest in Trash Party! We're stoked to have you as part of our community effort to keep Clayton clean.</p>
        
        <div style="background: #f0f8f0; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <p style="font-weight: 600; color: #2d5016; margin-bottom: 15px;">Here's what happens next:</p>
          <p style="margin: 8px 0; color: #333;">- Head outside whenever you feel like it (solo or with a neighbor)</p>
          <p style="margin: 8px 0; color: #333;">- Pick up some litter while you walk around</p>
          <p style="margin: 8px 0; color: #333;">- Log your cleanup on the map at <a href="https://trashparty.org" style="color: #2d5016;">trashparty.org</a></p>
          <p style="margin: 8px 0; color: #333;">- Feel good knowing you made a difference</p>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6; color: #333;">No meetings, no formal commitments—just neighbors helping neighbors make Clayton a little less trashy.</p>
        
        <p style="font-size: 16px; line-height: 1.6; color: #333;">We'll send you occasional updates about community cleanup efforts, but we promise not to clog your inbox.</p>
        
        <p style="font-size: 16px; line-height: 1.6; color: #333; margin-top: 30px;">Thanks Neighbor!</p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log('Welcome email sent to:', email);
  } catch (error) {
    console.error('Error sending email:', error);
  }
});
