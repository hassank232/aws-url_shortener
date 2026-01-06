import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' });
const dynamodb = DynamoDBDocumentClient.from(client);

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
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
    const result = await dynamodb.send(new GetCommand({
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
    await dynamodb.send(new UpdateCommand({
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

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};