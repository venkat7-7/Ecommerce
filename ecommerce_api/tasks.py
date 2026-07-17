import os
import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from .celery_app import celery_app
from .database import SessionLocal
from .models import Order, User

logger = logging.getLogger(__name__)

@celery_app.task(name="send_order_confirmation_email")
def send_order_confirmation_email(order_id: int):
    db = SessionLocal()
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            logger.error(f"Order {order_id} not found")
            return f"Order {order_id} not found"
        
        user = db.query(User).filter(User.id == order.user_id).first()
        if not user:
            logger.error(f"User for order {order_id} not found")
            return f"User for order {order_id} not found"
        
        # Prepare email content
        subject = f"Order Confirmation - {order.order_number}"
        
        # List order items
        items_text = ""
        for item in order.items:
            product_name = item.product.name if item.product else "Unknown Product"
            items_text += f"- {product_name} x {item.quantity} (₹{item.price_at_purchase} each)\n"
        
        email_body = f"""Hi {user.full_name},

Thank you for your order! Your order has been successfully placed.

Order Details:
Order Number: {order.order_number}
Date: {order.created_at.strftime('%Y-%m-%d %H:%M:%S')}
Payment Method: {order.payment_method}

Items:
{items_text}
Subtotal: ₹{order.subtotal}
Discount: ₹{order.discount}
Total: ₹{order.total}

Shipping Address:
{order.shipping_name}
{order.shipping_address}
{order.shipping_city}, {order.shipping_state} - {order.shipping_zip}

We will notify you once your order is shipped.

Best regards,
E-Commerce Team
"""
        
        # Send email
        smtp_server = os.getenv("SMTP_SERVER")
        smtp_port = os.getenv("SMTP_PORT")
        smtp_username = os.getenv("SMTP_USERNAME")
        smtp_password = os.getenv("SMTP_PASSWORD")
        sender_email = os.getenv("SENDER_EMAIL", "noreply@ecommerce.com")

        if smtp_server and smtp_port and smtp_username and smtp_password:
            # Actual SMTP execution
            msg = MIMEMultipart()
            msg['From'] = sender_email
            msg['To'] = user.email
            msg['Subject'] = subject
            msg.attach(MIMEText(email_body, 'plain'))

            with smtplib.SMTP(smtp_server, int(smtp_port)) as server:
                server.starttls()
                server.login(smtp_username, smtp_password)
                server.send_message(msg)
            
            logger.info(f"Order confirmation email sent to {user.email} for order {order.order_number}")
            return f"Email sent to {user.email}"
        else:
            # Fallback / Simulation mode
            logger.warning("SMTP credentials not configured. Simulating email send.")
            print("=" * 50)
            print(f"SIMULATED EMAIL SENT TO: {user.email}")
            print(f"SUBJECT: {subject}")
            print(email_body)
            print("=" * 50)
            
            # We can also write to a mock mail logs directory or file in the workspace
            # to make it easy to verify locally
            log_dir = "logs"
            if not os.path.exists(log_dir):
                os.makedirs(log_dir)
            with open(f"{log_dir}/email_order_{order.order_number}.txt", "w", encoding="utf-8") as f:
                f.write(email_body)
                
            return f"Simulation: Email logged for {user.email}"
            
    except Exception as e:
        logger.exception(f"Failed to send email for order {order_id}: {e}")
        return f"Error: {str(e)}"
    finally:
        db.close()
