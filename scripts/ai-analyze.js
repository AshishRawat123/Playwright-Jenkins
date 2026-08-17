const fs = require('fs');
const { GoogleGenAI } = require('@google/genai');

async function main() {

    // 1. Read Playwright results
    const results = JSON.parse(
        fs.readFileSync('test-results/results.json', 'utf-8')
    );

    console.log('Playwright results loaded.');

    // 2. Extract failed tests
    const failures = [];

    function processSuite(suite) {

        if (suite.specs) {
            for (const spec of suite.specs) {

                for (const test of spec.tests || []) {

                    if (test.status === 'failed' || test.status === 'unexpected') {

                        failures.push({
                            testName: spec.title,
                            file: spec.file,
                            status: test.status,
                            errors: test.results?.flatMap(
                                result => result.errors || []
                            ) || []
                        });
                    }
                }
            }
        }

        for (const childSuite of suite.suites || []) {
            processSuite(childSuite);
        }
    }

    for (const suite of results.suites || []) {
        processSuite(suite);
    }

    console.log(`Found ${failures.length} failed tests.`);

    // Nothing failed
    if (failures.length === 0) {

        console.log('No failed tests. AI analysis not required.');

        fs.writeFileSync(
            'ai-analysis.json',
            JSON.stringify({
                summary: 'All Playwright tests passed.',
                failures: []
            }, null, 2)
        );

        return;
    }

    // 3. Create AI prompt
    const prompt = `
You are a Senior QA Automation Engineer.

Analyze the following Playwright test failures.

For every failure classify it into exactly one category:

APPLICATION_BUG
AUTOMATION_BUG
FLAKY_TEST
TEST_DATA_ISSUE
ENVIRONMENT_ISSUE
NETWORK_ISSUE
UNKNOWN

For each failure provide:

- testName
- classification
- confidence (0 to 1)
- reason
- recommendation

Important:
Do not assume something is an application bug without evidence.
Use the error message and available information.

Playwright failures:

${JSON.stringify(failures, null, 2)}
`;

    // 4. Call Gemini
    const ai = new GoogleGenAI({
        // apiKey: process.env.GEMINI_API_KEY
        apiKey: 'AQ.Ab8RN6KlJ64UU3QFElCakO1tXUtWAlUq4Ch5TmsdS78h8AgB_A'
    });

    console.log('Sending failures to Gemini...');

    const interaction = await ai.interactions.create({
        model: 'gemini-3.6-flash',
        input: prompt
    });

    // 5. Get AI response
    const aiResponse = interaction.output_text;

    console.log('Gemini analysis received.');

    console.log('--------------------------------');
    console.log(aiResponse);
    console.log('--------------------------------');

    // 6. Save AI result
    fs.writeFileSync(
        'ai-analysis.json',
        JSON.stringify({
            generatedAt: new Date().toISOString(),
            failuresAnalyzed: failures.length,
            analysis: aiResponse
        }, null, 2)
    );

    console.log('AI analysis saved to ai-analysis.json');
}

main().catch(error => {
    console.error('Gemini API error:', error);
    process.exit(1);
});