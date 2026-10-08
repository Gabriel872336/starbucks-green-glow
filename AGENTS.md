<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep `/checkout` as an outlet layout with its payment screen in `checkout.index.tsx`, so nested completion pages render correctly.
- Keep the Barista assistant on a streaming `/api/chat` server route and store its single conversation only in browser localStorage, so AI credentials stay private while the chosen history behavior remains device-local.
- Generate receipt PDFs in the browser from the confirmed order snapshot, so customer details never leave the device for document creation.
- Define in-store products in the shared product data and render them through StoreFavorites with the storefront's purchase callback, so catalog, Barista, cart and receipts use identical items and login gating.
- Store the charged sale amount in Product.price and the display-only comparison amount in Product.originalPrice; share offer badges and price presentation between store and chat so cart, checkout and receipts charge the same discounted amount.
