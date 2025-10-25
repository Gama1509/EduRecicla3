import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(color_scheme="light")
        page = await context.new_page()
        await page.goto("http://localhost:3000")
        await page.screenshot(path="jules-scratch/verification/light-mode-pistachio.png")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
