use mongodb::{Client, error::Result};

#[tokio::main]
async fn main() -> Result<()> {
    // 1. Bağlantı adresinizi tanımlayın
    let uri = "mongodb://localhost:27017";

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
