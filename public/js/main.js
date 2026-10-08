document.addEventListener('DOMContentLoaded', () => {
    
    // Логіка перемикання табів у віджеті (Готівка / P2P)
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            button.classList.add('active');
            
            const selectedTab = button.getAttribute('data-tab');
            console.log('Обрано вкладку:', selectedTab);
        });
    });

    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        if(header) {
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                faqItems.forEach(faq => faq.classList.remove('active'));
                
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
});