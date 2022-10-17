/** function to add commas to numbers */
export function addCommas(num: number): string {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}