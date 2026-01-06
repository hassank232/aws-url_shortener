import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

// Initialize DynamoDB Client
const client = new DynamoDBClient({ region: 'us-east-1' });
const dynamodb = DynamoDBDocumentClient.from(client);

const TABLE_NAME = 'url-mappings';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    // Get shortCode from path parameters
    // API Gateway will send this as: { pathParameters: { shortCode: "kbZQBp" } }
    const shortCode = event.pathParameters?.shortCode;
    
    // Validate shortCode exists
    if (!shortCode) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: 'shortCode is required'
        })
      };
    }
    
    console.log('Looking up shortCode:', shortCode);
    
    // Query DynamoDB to get the URL mapping
    const result = await dynamodb.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        shortCode: shortCode
      }
    }));
    
    // Check if item was found
    if (!result.Item) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: 'Short URL not found'
        })
      };
    }
    
    console.log('Found item in DynamoDB:', result.Item);
    
    // Return the URL data
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        shortCode: result.Item.shortCode,
        longUrl: result.Item.longUrl,
        clicks: result.Item.clicks,
        createdAt: result.Item.createdAt
      })
    };
    
  } catch (error) {
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