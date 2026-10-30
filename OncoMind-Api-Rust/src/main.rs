use mongodb::{Client, error::Result};
use std::env;
use dotenvy::dotenv;

#[tokio::main]
async fn main() -> Result<()> {
    // 1. Bağlantı adresinizi tanımlayın
    let uri = "mongodb://localhost:27017";

    dotenv().ok();

    let queries:String = env::var("SELECT_QUERY")
        .unwrap_or_else(|_| "default_search_term".to_string());
    println!("The Select Query for table is {}", queries);
    // 2. MongoDB 3.x için bağlantıyı başlatan en sade yöntem
    let client = Client::with_uri_str(uri).await?;

    // 3. Bağlantıyı doğrulamak için ping atın
    client
        .database("admin")
        .run_command(mongodb::bson::doc! {"ping": 1})
        .await?;

    println!("Successfully connected to MongoDB!");

    Ok(())
}
