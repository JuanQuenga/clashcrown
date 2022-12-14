import * as bases from 'bases';
import Long from 'long';
import { gameTypes } from '../types/ClashRoyale';
import { IHiLo } from '../types/common/HiLo';

/**
 * Helper functions for handling hashtags from the game.
 */

const characterSet = '0289PYLQGRJCUV';
const characterCount = characterSet.length;

/**
 * Converts Hashtag (player or clantag) to a normalized version without # or common pitfalls
 * @param hashtag Player- or clantag
 */
export function normalizeHashtag(hashtag = ''): string {
	return hashtag?.trim().toUpperCase()
		.replace('#', '')
		.replace(/O/g, '0'); // replace capital O with zero
}

/**
 * Checks if a hashtag is potentially valid. Hashtags will be normalized before running through the test.
 * @param hashtag The to be checked hashtag
 */
export function isValidHashtag(hashtag: string): boolean {
	// Simple validation first before doing computationally more expensive stuff
	if (hashtag === undefined || hashtag === null) return false;
	if (hashtag.length > 14 || hashtag.length < 3) return false;

	const tagNormalized = normalizeHashtag(hashtag);
	const tagCharacters = ['0', '2', '8', '9', 'P', 'Y', 'L', 'Q', 'G', 'R', 'J', 'C', 'U', 'V'];

	for (const char of tagNormalized) {
		if (tagCharacters.indexOf(char) === -1) return false;
	}

	return true;
}

/**
 * Player Hashtags consist of high and low ids which are used for a better loadbalancing
 * on Supercells end. This HiLo algorithm reverses player tags to their hi and lo ids
 *
 * @param hashtag Normalized player tag
 */
export function getHiLoFromHashtag(hashtag: string): IHiLo {
	let id = 0;
	hashtag.split('').forEach((char: string) => {
		const charIndex = characterSet.indexOf(char);
		if (charIndex === -1) {
			// Invalid char in playerTag has been used to calculate the HiLo
			return null;
		}
		id = id * characterCount;
		id += charIndex;
	});

	const hi = id % 256;
	// tslint:disable-next-line:no-bitwise
	const lo = (id - hi) >>> 8;

	return {
		high: hi,
		low: lo
	};
}

/**
 * Returns a player tag (without hashtag) for a given playerid
 * @param high Player's high bits
 * @param low Player's low bits
 */
export function getHashtagFromHiLo(high: number, low: number): string {
	if (high >= 255) { return ''; }

	let id: Long = new Long(low, 0, true);
	// tslint:disable-next-line:no-bitwise
	id = id.shiftLeft(8);
	id = id.or(high);
	const hashTagId = id.toNumber();
	let hashtag = '';

	// Base14 encode
	hashtag = bases.toAlphabet(hashTagId, characterSet);

	return hashtag;
}

/**
 * Returns a user friendly game type name for a given gameType id
 * @param gameType The gametype to be resolved
 */
export function getGameTypeName(gameType: string): string {
	return gameTypes[gameType] as string;
}

export function cardImageURL(cardName: string, gold = false): string {
	const cardSlug = cardName.toLocaleLowerCase().replaceAll(" ", "-").replaceAll(".", "");

	return `/images/${gold ? 'cards-gold' : 'cards'}/${cardSlug}.png`;
}
