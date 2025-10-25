from playwright.sync_api import Page, expect

def test_admin_product_page(page: Page):
    page.goto("http://localhost:3000/login")
    page.get_by_label("Email").fill("admin@example.com")
    page.get_by_label("Password").fill("password")
    page.get_by_role("button", name="Login").click()
    page.wait_for_url("http://localhost:3000/admin/products")
    expect(page).to_have_title("Admin Products")
    page.screenshot(path="jules-scratch/verification/admin-products.png")
    page.get_by_role("link", name="Add New Product").click()
    page.wait_for_url("http://localhost:3000/admin/products/new")
    expect(page).to_have_title("Add New Product")
    page.screenshot(path="jules-scratch/verification/new-product-form.png")
