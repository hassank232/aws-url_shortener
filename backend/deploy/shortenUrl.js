"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
// Initialize DynamoDB Client
const client = new client_dynamodb_1.DynamoDBClient({ region: 'us-east-1' });
const dynamodb = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
const TABLE_NAME = 'url-mappings';
function generateShortCode(length = 6) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}
const handler = async (event) => {
    try {
        console.log('Received event:', JSON.stringify(event, null, 2));
        // Parse the request body
        const body = JSON.parse(event.body || '{}');
        const longUrl = body.longUrl;
        // Validate that longUrl exists
        if (!longUrl) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    error: 'longUrl is required'
                })
            };
        }
        // Generate a short code
        const shortCode = generateShortCode();
        // Create the item to save in DynamoDB
        const item = {
            shortCode: shortCode,
            longUrl: longUrl,
            clicks: 0,
            createdAt: new Date().toISOString()
        };
        // Save to DynamoDB
        await dynamodb.send(new lib_dynamodb_1.PutCommand({
            TableName: TABLE_NAME,
            Item: item
        }));
        console.log('Successfully saved to DynamoDB:', item);
        // Return success response
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                shortCode: shortCode,
                longUrl: longUrl,
                message: 'URL shortened successfully'
            })
        };
    }
    catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error'
            })
        };
    }
};
exports.handler = handler;
