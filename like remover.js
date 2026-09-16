(async function() {
    console.log("🚀 Starting automatic removal of liked videos...");
    
    let removedCount = 0;
    const totalToRemove = 4084;
    let scrollAttempts = 0;
    
    // Click the "Remove from Liked videos" option
    async function clickRemoveOption() {
        const menuItems = document.querySelectorAll('ytd-menu-service-item-renderer');
        
        for (const item of menuItems) {
            const text = item.textContent || item.innerText || '';
            if (text.includes('Remove from Liked') || 
                text.includes('Remove from liked') ||
                text.includes('Unlike')) {
                item.click();
                removedCount++;
                
                // Update progress
                const progress = ((removedCount / totalToRemove) * 100).toFixed(1);
                console.log(`✅ Removed ${removedCount}/${totalToRemove} (${progress}%)`);
                
                // Close any open menus
                setTimeout(() => {
                    const active = document.activeElement;
                    if (active && active.blur) active.blur();
                }, 50);
                
                return true;
            }
        }
        return false;
    }
    
    // Main removal loop
    async function processBatch() {
        // Get all three-dot menu buttons
        const menuButtons = document.querySelectorAll('button[aria-label="Action menu"], button[aria-label*="menu"]');
        
        if (menuButtons.length === 0) {
            console.log("No menu buttons found. Scrolling...");
            window.scrollBy(0, 1000);
            scrollAttempts++;
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            if (scrollAttempts > 5) {
                console.log("Scrolled enough. Looking for loaded buttons...");
                scrollAttempts = 0;
            }
            return true; // Continue
        }
        
        console.log(`Found ${menuButtons.length} menu buttons`);
        
        // Process each menu button
        for (let i = 0; i < menuButtons.length; i++) {
            if (removedCount >= totalToRemove) {
                console.log("🎉 Target reached!");
                return false; // Stop
            }
            
            try {
                // Click the three-dot menu
                menuButtons[i].click();
                await new Promise(resolve => setTimeout(resolve, 300));
                
                // Click the remove option
                const clicked = await clickRemoveOption();
                
                if (!clicked) {
                    // If remove option not found, close menu
                    document.activeElement.blur();
                }
                
                // Small delay between actions
                await new Promise(resolve => setTimeout(resolve, 200));
                
            } catch (error) {
                console.log("Error on button", i, error);
            }
        }
        
        // Scroll after processing batch
        window.scrollBy(0, 800);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return true; // Continue
    }
    
    // Run until done
    console.log(`Starting to remove ${totalToRemove} liked videos...`);
    console.log("Make sure you're on: youtube.com/playlist?list=LL");
    
    while (removedCount < totalToRemove) {
        const shouldContinue = await processBatch();
        if (!shouldContinue) break;
        
        // Safety check
        if (removedCount % 100 === 0) {
            console.log(`⏸️ Pause after ${removedCount} removals...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    console.log(`✅️ Finished! Removed ${removedCount} liked videos.`);
    console.log("Refresh the page to see updated count.");
})();