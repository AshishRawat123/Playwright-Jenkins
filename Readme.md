# Execute test single spec in local
*npx playwright test tests/login.spec.ts --headed*

# Execute a project
*npx playwright test --project='Project name as per config file'*

# Execute test in different sets with any suite
*npx playwright test --shard=1/2 --reporter=blob*

# Open a specific trace file - is basically for jenkins
*npx playwright show-trace test-results/my-test-folder/trace.zip*

# open report
*npx playwright show-report*

# Remove .env file for security purposes and manage a secret file in jenkins for that. Also name it "PLAYWRIGHT_SECRET_FILE" as per mentioned in Jenkins file

