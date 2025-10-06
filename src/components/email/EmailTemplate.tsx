import React from 'react';

interface EmailTemplateProps {
  title: string;
  children: React.ReactNode;
  footerText?: string;
}

export default function EmailTemplate({ 
  title, 
  children, 
  footerText = "TDC Market - Türkiye'nin En Büyük Online Alışveriş Platformu" 
}: EmailTemplateProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <style>
          {`
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f8f9fa;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #CBA135 0%, #F4D03F 100%);
              padding: 30px 20px;
              text-align: center;
            }
            .header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 24px;
              font-weight: bold;
            }
            .content {
              padding: 30px 20px;
            }
            .footer {
              background-color: #f8f9fa;
              padding: 20px;
              text-align: center;
              border-top: 1px solid #e9ecef;
            }
            .footer p {
              margin: 0;
              color: #6c757d;
              font-size: 14px;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #CBA135;
              color: #ffffff;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 500;
              margin: 10px 0;
            }
            .button:hover {
              background-color: #B8941F;
            }
            .product-card {
              border: 1px solid #e9ecef;
              border-radius: 8px;
              padding: 20px;
              margin: 15px 0;
              background-color: #f8f9fa;
            }
            .order-summary {
              background-color: #f8f9fa;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .order-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 10px 0;
              border-bottom: 1px solid #e9ecef;
            }
            .order-item:last-child {
              border-bottom: none;
            }
            .total {
              font-weight: bold;
              font-size: 18px;
              color: #CBA135;
              margin-top: 15px;
              padding-top: 15px;
              border-top: 2px solid #CBA135;
            }
            .social-links {
              margin: 20px 0;
            }
            .social-links a {
              display: inline-block;
              margin: 0 10px;
              color: #6c757d;
              text-decoration: none;
            }
            .social-links a:hover {
              color: #CBA135;
            }
            @media (max-width: 600px) {
              .container {
                margin: 0;
                border-radius: 0;
              }
              .content {
                padding: 20px 15px;
              }
              .header {
                padding: 20px 15px;
              }
            }
          `}
        </style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h1>{title}</h1>
          </div>
          
          <div className="content">
            {children}
          </div>
          
          <div className="footer">
            <p>{footerText}</p>
            <div className="social-links">
              <a href="https://tdcmarket.com">Web Sitesi</a>
              <a href="https://tdcmarket.com/hakkimizda">Hakkımızda</a>
              <a href="https://tdcmarket.com/iletisim">İletişim</a>
            </div>
            <p>
              Bu e-postayı istemediğiniz için özür dileriz. 
              <a href="https://tdcmarket.com/unsubscribe">Abonelikten çıkın</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
