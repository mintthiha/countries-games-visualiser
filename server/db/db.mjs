import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';
const dbUrl = process.env.ATLAS_URI;

/**
 * Provided db class
 */
class DB {
  static db = null;
  static instance = null;
  static collection = null;
  static mongoClient = null;
  constructor(){
    //instance is the singleton, defined in outer scope
    DB.instance = this;
    return DB.instance;
  }
  async connect(dbname, collName) {
    if (DB.instance.db){
      DB.instance.db = await DB.instance.mongoClient.db(dbname);
      // Send a ping to confirm a successful connection
      await DB.instance.mongoClient.db(dbname).command({ ping: 1 });
      console.log('Successfully connected to MongoDB database ' + dbname);
      DB.instance.collection = await DB.instance.db.collection(collName);
    }
    if(!dbUrl){
      throw new Error('dbUrl is not defined please check your .env file or dotenv is installed');
    }
    if(!this.mongoClient){
      this.mongoClient = new MongoClient(dbUrl), {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      };
    }
    await DB.instance.mongoClient.connect();
    DB.instance.db = await DB.instance.mongoClient.db(dbname);
    // Send a ping to confirm a successful connection
    await DB.instance.mongoClient.db(dbname).command({ ping: 1 });
    console.log('Successfully connected to MongoDB database ' + dbname);
    DB.instance.collection = await DB.instance.db.collection(collName);
  }
  async close() {
    await DB.instance.mongoClient.close();
    this.instance = null;
  }
  async readAll() {
    return await DB.instance.collection.find().toArray();
  }
  async create(data) {
    return await DB.instance.collection.insertOne(data);
  }
  async createMany(data) {
    return await DB.instance.collection.insertMany(data);
  }
  async deleteMany(data){
    return await DB.instance.collection.deleteMany(data);
  }
  async open(dbname, collName) {
    try {
      await DB.instance.connect(dbname, collName);
    } finally {
      await DB.instance.close();
    }
  }
}

export const db = new DB();