import { createTransform } from 'redux-persist';
import get from 'lodash.get';
import set from 'lodash.set';
import unset from 'lodash.unset';
import pickBy from 'lodash.pickby';
import isEmpty from 'lodash.isempty';
import forIn from 'lodash.forin';
import cloneDeep from 'lodash.clonedeep';

export function createFilter (reducerName, inboundPaths, outboundPaths, transformType = 'whitelist', firstPage = false, keys = false) {
	return createTransform(
		// inbound
		(inboundState, key) => {
			return inboundPaths
				? persistFilter(inboundState, inboundPaths, transformType, firstPage, keys)
				: inboundState;
		},

		// outbound
		(outboundState, key) => {
			return outboundPaths
				? persistFilter(outboundState, outboundPaths, transformType, firstPage, keys)
				: outboundState;
		},

		{'whitelist': [reducerName]}
	);
};

export function createWhitelistFilter (reducerName, inboundPaths, outboundPaths) {
	return createFilter(reducerName, inboundPaths, outboundPaths, 'whitelist');
}

export function createBlacklistFilter (reducerName, inboundPaths, outboundPaths) {
	return createFilter(reducerName, inboundPaths, outboundPaths, 'blacklist');
}

export function persistCache(reducerName, inboundPaths = ["initial"], outboundPaths) {
	const reducer = reducerName.includes(".keys") ? reducerName.split(".")[0] : reducerName;
	return createFilter(reducer, inboundPaths, outboundPaths, "blacklist", true, reducerName.includes(".keys"));
}


function filterObject({ path, filterFunction = () => true }, state) {
	const value = get(state, path, state);

	if (value instanceof Array) {
		return value.filter(filterFunction)
	}

	return pickBy(value, filterFunction);
}

export function filterInitial(state, keys) {
	let subset = {};
	subset = cloneDeep(state);

	if(keys) {
		Object.keys(subset).forEach(key=> {
			const list = {};
			subset[key].show = [];
			if (!subset[key].initial) subset[key].initial = [];

			subset[key].initial.forEach((id) => {
				if (subset[key].list[id]) {
					list[id] = subset[key].list[id];
					subset[key].show.push(id);
				}
			});

			subset[key].initial = subset[key].show;
			subset[key].list = list;
		})
		return subset;
	}

	const list = {};
	subset.show = [];
	if (!subset.initial) subset.initial = [];

	subset.initial.forEach((id) => {
		if (subset.list[id]) {
			list[id] = subset.list[id];
			subset.show.push(id);
		}
	});

	subset.initial = subset.show;
	subset.list = list;

	return subset;
}

export function persistFilter (state, paths = [], transformType = 'whitelist', firstPage, keys) {
	let subset = {};

	// support only one key
	if (typeof paths === 'string') {
		paths = [paths];
	}

	if (firstPage) return filterInitial(state, keys);

	if (transformType === 'whitelist') {
		paths.forEach((path) => {
			if (typeof path === 'object' && !(path instanceof Array)) {
				const value = filterObject(path, state);

				if (!isEmpty(value)) {
					set(subset, path.path, value);
				}
			} else {
				const value = get(state, path);

				if (typeof value !== 'undefined') {
					set(subset, path, value);
				}
			}
		});
	} else if (transformType === 'blacklist') {
		subset = cloneDeep(state);
		paths.forEach((path) => {
			if (typeof path === 'object' && !(path instanceof Array)) {
				const value = filterObject(path, state);

				if (!isEmpty(value)) {
					if (value instanceof Array) {
						set(subset, path.path, get(subset, path.path, subset).filter((x) => false));
					} else {
						forIn(value, (value, key) => { unset(subset, `${path.path}[${key}]`) });
					}
        } else {
          subset = value;
        }
			} else {
				const value = get(state, path);

				if (typeof value !== 'undefined') {
					unset(subset, path);
				}
			}
		});
	} else {
		subset = state;
	}

	return subset;
}

export default createFilter;
