import { log } from '../config.js';
const tagMixin = (mixinBase) => {
    class TagMixin extends mixinBase {
        constructor(...args) {
            super(...args);
            log.verbose('PuppetTagMixin', 'constructor()');
        }
    }
    return TagMixin;
};
export { tagMixin };
