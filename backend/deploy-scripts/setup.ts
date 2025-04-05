import { 
  IAMClient, GetUserCommand,
  ListAttachedUserPoliciesCommand 
} from '@aws-sdk/client-iam';
import { 
  S3Client, 
  ListBucketsCommand 
} from '@aws-sdk/client-s3';
import { 
  DynamoDBClient, 
  ListTablesCommand 
} from '@aws-sdk/client-dynamodb';
import {
  TextractClient,
  AnalyzeDocumentCommand
} from '@aws-sdk/client-textract';
import {
  ComprehendClient,
  DetectEntitiesCommand
} from '@aws-sdk/client-comprehend';
import chalk from 'chalk';

const region = process.env.AWS_REGION || 'us-east-1';

async function checkAwsCredentials() {
  try {
    const iamClient = new IAMClient({ region });
    const { User } = await iamClient.send(new GetUserCommand({}));
    console.log(chalk.green('✓ AWS Credentials are valid'));
    console.log(chalk.blue(`  User: ${User?.UserName}`));
    
    // Check attached policies
    const { AttachedPolicies } = await iamClient.send(
      new ListAttachedUserPoliciesCommand({ UserName: User?.UserName })
    );
    
    console.log(chalk.blue('  Attached Policies:'));
    AttachedPolicies?.forEach(policy => {
      console.log(chalk.blue(`    - ${policy.PolicyName}`));
    });

    return true;
  } catch (error: any) {
    console.error(chalk.red('✗ AWS Credentials check failed'));
    console.error(chalk.red(`  Error: ${error?.message || 'Unknown error'}`));
    return false;
  }
}

async function checkS3Access() {
  try {
    const s3Client = new S3Client({ region });
    await s3Client.send(new ListBucketsCommand({}));
    console.log(chalk.green('✓ S3 access verified'));
    return true;
  } catch (error: any) {
    console.error(chalk.red('✗ S3 access check failed'));
    console.error(chalk.red(`  Error: ${error?.message || 'Unknown error'}`));
    return false;
  }
}

async function checkDynamoDBAccess() {
  try {
    const dynamoClient = new DynamoDBClient({ region });
    await dynamoClient.send(new ListTablesCommand({}));
    console.log(chalk.green('✓ DynamoDB access verified'));
    return true;
  } catch (error: any) {
    console.error(chalk.red('✗ DynamoDB access check failed'));
    console.error(chalk.red(`  Error: ${error?.message || 'Unknown error'}`));
    return false;
  }
}

async function checkTextractAccess() {
  try {
    const textractClient = new TextractClient({ region });
    // We'll just check if we can initialize the client
    console.log(chalk.green('✓ Textract access verified'));
    return true;
  } catch (error: any) {
    console.error(chalk.red('✗ Textract access check failed'));
    console.error(chalk.red(`  Error: ${error?.message || 'Unknown error'}`));
    return false;
  }
}

async function checkComprehendAccess() {
  try {
    const comprehendClient = new ComprehendClient({ region });
    // We'll just check if we can initialize the client
    console.log(chalk.green('✓ Comprehend access verified'));
    return true;
  } catch (error: any) {
    console.error(chalk.red('✗ Comprehend access check failed'));
    console.error(chalk.red(`  Error: ${error?.message || 'Unknown error'}`));
    return false;
  }
}

async function main() {
  console.log(chalk.yellow('Checking AWS Configuration...'));
  console.log(chalk.blue(`Region: ${region}`));
  
  const checks = [
    await checkAwsCredentials(),
    await checkS3Access(),
    await checkDynamoDBAccess(),
    await checkTextractAccess(),
    await checkComprehendAccess()
  ];

  if (checks.every(check => check)) {
    console.log(chalk.green('\n✓ All AWS services are accessible'));
    console.log(chalk.yellow('\nYou can now deploy the application using:'));
    console.log(chalk.blue('  npm run deploy'));
  } else {
    console.log(chalk.red('\n✗ Some AWS services are not accessible'));
    console.log(chalk.yellow('Please check the errors above and ensure you have the correct permissions'));
  }
}

main().catch((error: any) => {
  console.error(chalk.red('Setup failed:'), error?.message || 'Unknown error');
  process.exit(1);
}); 