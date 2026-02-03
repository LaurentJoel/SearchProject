import psycopg2
import sys

def create_database():
    print("Creating database 'search_presentation'...")
    
    try:
        # First connect to default postgres database
        conn = psycopg2.connect(
            host="localhost",
            port=5432,
            user="postgres",
            password="mkounga10",
            database="postgres"  # Connect to default database
        )
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Create database
        cursor.execute("CREATE DATABASE search_presentation;")
        print("✅ Database 'search_presentation' created successfully!")
        
        cursor.close()
        conn.close()
        
        # Now test connection to new database
        print("\nTesting connection to new database...")
        conn = psycopg2.connect(
            host="localhost",
            port=5432,
            user="postgres",
            password="mkounga10",
            database="search_presentation"
        )
        cursor = conn.cursor()
        cursor.execute("SELECT version();")
        version = cursor.fetchone()
        print(f"✅ Connected to PostgreSQL: {version[0]}")
        
        cursor.close()
        conn.close()
        
    except psycopg2.errors.DuplicateDatabase:
        print("⚠ Database 'search_presentation' already exists.")
    except psycopg2.OperationalError as e:
        print(f"❌ Error: {e}")
        print("\nTroubleshooting:")
        print("1. Make sure PostgreSQL service is running")
        print("2. Check if password is correct")
        print("3. Try running as Administrator")
        sys.exit(1)

if __name__ == "__main__":
    create_database()