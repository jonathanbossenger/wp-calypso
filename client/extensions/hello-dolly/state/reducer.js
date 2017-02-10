/**
 * Internal dependencies
 */
import {
	HELLO_DOLLY_NEXT_LYRIC,
} from './action-types';

const lyrics = [
	'Hello, Dolly',
	'Well, hello, Dolly',
	'It\'s so nice to have you back where you belong',
	'You\'re lookin\' swell, Dolly',
	'I can tell, Dolly',
	'You\'re still glowin\', you\'re still crowin\'',
	'You\'re still goin\' strong',
	'We feel the room swayin\'',
	'While the band\'s playin\'',
	'One of your old favourite songs from way back when',
	'So, take her wrap, fellas',
	'Find her an empty lap, fellas',
	'Dolly\'ll never go away again',
	'Hello, Dolly',
	'Well, hello, Dolly',
	'It\'s so nice to have you back where you belong',
	'You\'re lookin\' swell, Dolly',
	'I can tell, Dolly',
	'You\'re still glowin\', you\'re still crowin\'',
	'You\'re still goin\' strong',
	'We feel the room swayin\'',
	'While the band\'s playin\'',
	'One of your old favourite songs from way back when',
	'Golly, gee, fellas',
	'Find her a vacant knee, fellas',
	'Dolly\'ll never go away',
	'Dolly\'ll never go away',
	'Dolly\'ll never go away again'
];

const initialState = {
	lyric: lyrics[ 0 ],
	lyricIndex: 0
};

export default function( state = initialState, action ) {
	switch ( action.type ) {
		case HELLO_DOLLY_NEXT_LYRIC:
			advanceToNextLyric( state );
		default:
			return state;
	}
}

function advanceToNextLyric( state ) {
	const { lyricIndex } = state;
	const newIndex = ( lyricIndex < lyrics.length - 1 ? lyricIndex + 1 : 0 );
	const newLyric = lyrics[ newIndex ];

	return {
		...state,
		lyric: newLyric,
		lyricIndex: newIndex,
	};
}
