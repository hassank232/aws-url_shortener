"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client = new client_dynamodb_1.DynamoDBClient({ region: 'us-east-1' });
const dynamodb = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
const handler = async (event) => {
    try {
        // Extract short code from URL path
        const shortCode = event.pathParameters?.shortCode;
        // Validate input
        if (!shortCode) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'shortCode is required' })
            };
        }
        // Get URL from DynamoDB
        const result = await dynamodb.send(new lib_dynamodb_1.GetCommand({
            TableName: 'url-mappings',
            Key: { shortCode }
        }));
        // Check if short code exists
        if (!result.Item) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Short URL not found' })
            };
        }
        const longUrl = result.Item.longUrl;
        // Increment click counter atomically
        await dynamodb.send(new lib_dynamodb_1.UpdateCommand({
            TableName: 'url-mappings',
            Key: { shortCode },
            UpdateExpression: 'SET clicks = clicks + :inc',
            ExpressionAttributeValues: {
                ':inc': 1
            }
        }));
        // Return 301 redirect
        return {
            statusCode: 301,
            headers: {
                'Location': longUrl,
                'Cache-Control': 'no-cache'
            },
            body: ''
        };
    }
    catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
exports.handler = handler;
