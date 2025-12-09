import axios from 'axios';

async function test() {
    console.log('Probando Hugging Face API...');
    
    try {
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
            {
                inputs: "Hola, ¿cómo estás?",
                parameters: {
                    max_new_tokens: 100,
                    temperature: 0.7
                }
            }
        );
        
        console.log('¡ÉXITO!', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('ERROR:', error.response?.status);
        console.error('DATOS:', JSON.stringify(error.response?.data, null, 2));
    }
}

test();
