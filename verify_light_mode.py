from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()
    page.goto("http://localhost:3000")
    page.evaluate("() => { localStorage.setItem('theme', 'light'); location.reload(); }")
    page.wait_for_load_state('networkidle')
    page.screenshot(path="light-mode-pistachio.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
