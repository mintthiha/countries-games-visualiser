import { promises as fs } from 'fs';
import path from 'path';

/**
 * Reads and parses a JSON file from the specified file path.
 *
 * @async
 * @function readFileFromPath
 * 
 * @param {string} dataPath - The relative or absolute path to the JSON file.
 * 
 * @returns {string}} - A promise that resolves to the parsed JSON object.
 * 
 * @example
 * // Example usage:
 * const data = await readFileFromPath('./server/data/worldjson.json');
 * console.log(data);
 * 
 * @throws {Error} Will throw an error if the file 
 * cannot be read or if the content is not valid JSON.
 */
export async function readFileFromPath(dataPath){
  const filePath = path.resolve(dataPath);

  const data = await fs.readFile(filePath, 'utf-8');

  return JSON.parse(data);
}