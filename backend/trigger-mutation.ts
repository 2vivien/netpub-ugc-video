
const GRAPHQL_ENDPOINT = 'http://localhost:4000/graphql';

async function triggerMutation() {
    console.log('--- Triggering sendContactMessage Mutation ---');

    const variables = {
        name: 'Test via Mutation',
        email: 'test_mutation@example.com',
        company: 'Mutation Testing Co',
        service: 'UGC',
        message: 'Testing if server logs anything when this mutation is called.'
    };

    const query = `
    mutation SendContactMessage($name: String!, $email: String!, $company: String, $service: String, $message: String!) {
      sendContactMessage(name: $name, email: $email, company: $company, service: $service, message: $message)
    }
  `;

    try {
        const response = await fetch(GRAPHQL_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables
            }),
        });

        const result = await response.json();
        console.log('Mutation Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('ERROR triggering mutation:', error);
    }
}

triggerMutation();
