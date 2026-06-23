import Navbar from './Navbar';

const FAQ = () => {
    const faqs = [
        {
            question: 'What is Code Cruncher?',
            answer: 'Code Cruncher is a web-based tool that analyzes your source code and provides detailed insights about its time and space complexity, along with human-readable explanations and visual graphs.'
        },
        {
            question: 'Which programming languages does Code Cruncher support?',
            answer: 'Currently, it supports C++, Java, and JavaScript, with plans to expand to Python and C# in future versions.'
        },
        {
            question: 'How does Code Cruncher calculate code complexity?',
            answer: 'It uses a combination of static analysis techniques and AI-based LLM APIs to estimate the best, average, and worst-case time and space complexities of your code.'
        },
        {
            question: 'Do I need to install any software to use it?',
            answer: 'No installation is required. Code Cruncher runs entirely in the browser, and you can access it from any device with an internet connection.'
        },
        {
            question: 'What is the difference between static and AI-based analysis?',
            answer: 'Static analysis evaluates code structure and control flow without running it, while AI-based analysis uses a language model (like GPT or Gemini) to interpret logic and provide natural language explanations.'
        },
        {
            question: 'Is my code data safe and private?',
            answer: 'Yes. Code Cruncher ensures that user code is not stored permanently or shared externally. All analysis is processed securely through the backend.'
        },
        {
            question: 'How much code can I analyze at once?',
            answer: 'You can analyze up to 300–500 lines per request when using the LLM-based mode due to API token limits. Static analysis supports larger code files.'
        },
        {
            question: 'What kind of visual results does the system provide?',
            answer: 'The results include graphs and charts showing time and space complexity comparisons, helping you visualize performance easily.'
        },
        {
            question: 'Can Code Cruncher suggest improvements in my code?',
            answer: 'Yes. The AI-based module can suggest optimization tips and highlight potential areas of inefficiency in your code logic.'
        },
        {
            question: 'Is Code Cruncher free to use?',
            answer: 'Yes, the basic features are free. However, advanced AI-based analysis may depend on API usage limits or premium features in the future.'
        },
    ];
  return (
    <div className='w-[1250px] flex flex-col items-center content-center mt-15'>
        <Navbar />
        <div className='mx-auto my-10'>
            <a href="#" className='text-amber-200 font-interx font-bold text-5xl'>FAQs</a>
        </div>
        {faqs.map(faq => (
            <div className='font-[inter] font-normal text-[#c6bcbc] text-3xl w-[1200px]'>
                <p className='font-bold'>{faq.question}</p>
                <p className='text-2xl'>{faq.answer}</p><br />
            </div>
            
        ))}
    </div>
  )
}

export default FAQ
