
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()

    # Emulate light mode
    context_light = browser.new_context(color_scheme='light')
    page_light = context_light.new_page()
    page_light.goto('http://localhost:3000')
    page_light.screenshot(path='jules-scratch/verification/light-mode.png')
    context_light.close()

    # Emulate dark mode
    context_dark = browser.new_context(color_scheme='dark')
    page_dark = context_dark.new_page()
    page_dark.goto('http://localhost:3000')
    page_dark.screenshot(path='jules-scratch/verification/dark-mode.png')
    context_dark.close()

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
