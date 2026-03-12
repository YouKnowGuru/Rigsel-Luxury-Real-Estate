export const getAdminNotificationEmail = (data: { name: string; email: string; phone: string; subject?: string; message: string; propertyTitle?: string }) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'serif', 'Times New Roman'; color: #1a1a1a; line-height: 1.6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; border: 1px solid #e0d5b1; }
        .header { background-color: #1a1a1a; padding: 40px; text-align: center; border-bottom: 4px solid #b38b24; }
        .logo { color: #b38b24; font-size: 28px; font-weight: bold; letter-spacing: 4px; text-transform: uppercase; }
        .content { padding: 40px; background-color: #f9f7f2; }
        .title { font-size: 22px; color: #8e1b1b; margin-bottom: 20px; font-weight: bold; border-left: 3px solid #8e1b1b; padding-left: 15px; }
        .field { margin-bottom: 20px; }
        .label { font-size: 10px; font-weight: bold; text-transform: uppercase; color: #999; letter-spacing: 2px; display: block; margin-bottom: 5px; }
        .value { font-size: 16px; color: #1a1a1a; font-weight: 500; }
        .message-box { background-color: white; padding: 25px; border: 1px solid #e0d5b1; border-radius: 8px; margin-top: 20px; font-style: italic; }
        .footer { background-color: #1a1a1a; color: white; padding: 30px; text-align: center; font-size: 11px; letter-spacing: 1px; }
        .accent { color: #b38b24; font-weight: bold; }
        .property-badge { display: inline-block; padding: 5px 12px; background-color: #b38b24; color: white; font-size: 12px; font-weight: bold; border-radius: 4px; margin-bottom: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div style="width: 80px; height: 80px; background-color: white; border-radius: 50%; margin: 0 auto 15px; overflow: hidden; border: 3px solid #b38b24;">
                <img src="cid:logo" alt="Phojaa" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div class="logo">Phojaa <span style="font-style: italic; font-weight: 200;">Real Estate</span></div>
        </div>
        <div class="content">
            <div class="title">New Property Inquiry</div>
            ${data.propertyTitle ? `<div class="property-badge">RE: ${data.propertyTitle}</div>` : ""}
            <div class="field">
                <span class="label">From Client</span>
                <span class="value">${data.name}</span>
            </div>
            <div class="field">
                <span class="label">Contact Details</span>
                <span class="value">${data.email} | ${data.phone}</span>
            </div>
            ${data.subject ? `
            <div class="field">
                <span class="label">Subject</span>
                <span class="value">${data.subject}</span>
            </div>` : ""}
            <div class="field">
                <span class="label">Message</span>
                <div class="message-box">${data.message}</div>
            </div>
        </div>
        <div class="footer">
            <p>PHOJAA REAL ESTATE <span class="accent">BHUTAN</span></p>
            <p style="opacity: 0.5;">ADMIN NOTIFICATION SYSTEM</p>
        </div>
    </div>
</body>
</html>
`;

export const getUserAutoReplyEmail = (name: string) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'serif', 'Times New Roman'; color: #1a1a1a; line-height: 1.8; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #f9f7f2; }
        .hero { background-color: #1a1a1a; padding: 60px 40px; text-align: center; border-bottom: 4px solid #b38b24; }
        .logo { color: #b38b24; font-size: 32px; font-weight: bold; letter-spacing: 6px; text-transform: uppercase; margin-bottom: 10px; }
        .sub-logo { color: white; font-size: 10px; letter-spacing: 4px; text-transform: uppercase; opacity: 0.6; }
        .content { padding: 60px 50px; text-align: center; }
        .greeting { font-size: 24px; color: #1a1a1a; margin-bottom: 30px; }
        .text { color: #444; font-size: 16px; margin-bottom: 40px; font-style: italic; }
        .divider { width: 50px; hieght: 2px; background-color: #b38b24; margin: 30px auto; }
        .footer { padding: 40px; border-top: 1px solid #e0d5b1; text-align: center; font-size: 12px; color: #888; }
        .social { margin-top: 20px; }
        .bhutan-accent { color: #8e1b1b; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="hero">
            <div style="width: 100px; height: 100px; background-color: white; border-radius: 50%; margin: 0 auto 20px; overflow: hidden; border: 4px solid #b38b24;">
                <img src="cid:logo" alt="Phojaa" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div class="logo">Phojaa</div>
            <div class="sub-logo">Your Journey to a Perfect Home in Bhutan</div>
        </div>
        <div class="content">
            <div class="greeting">Kuzuzangpo La, <span class="bhutan-accent">${name}</span></div>
            <div class="text">
                "Thank you for reaching out to our family. We have safely received your message and our team is already reviewing your inquiry."
            </div>
            <div class="divider"></div>
            <div class="text">
                One of our estate experts will contact you directly within the next 24 hours to discuss your aspirations in detail.
            </div>
            <p style="font-size: 14px; color: #b38b24; margin-top: 50px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">We look forward to serving you.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Phojaa Real Estate. All rights reserved.</p>
            <p>Paro, Kingdom of <span class="bhutan-accent">Bhutan</span></p>
        </div>
    </div>
</body>
</html>
`;
