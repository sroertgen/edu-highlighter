import { error } from '@sveltejs/kit';
import { Readability, isProbablyReaderable } from '@mozilla/readability';
import { parseHTML } from 'linkedom';

export async function load({ fetch, url }) {
  const loadUrl = String(url.searchParams.get('url') ?? '');
  console.log(loadUrl)
  const res = await fetch(loadUrl);
  const htmlText = await res.text();

  return {
    htmlText,
    url: loadUrl,
  };
}
