/*
    Copyright 2015 John Mothershed

    Licensed under the Apache License, Version 2.0 (the `License`);
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an `AS IS` BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
 */

import _ from "lodash";

/**
 * @module cypher-tools
 * @requires {@link https://www.npmjs.com/package/lodash|lodash}
 */

/**
 * All methods are static, instance creation is not needed
 *
 * @class module:cypher-tools
 * @classdesc
 * Collection of utility methods for cypher queries
 * @author {@link http://codepen.io/wiseguy12851|John Mothershed}
 * @copyright 2015 John Mothershed
 * @license {@link http://www.apache.org/licenses/LICENSE-2.0|Apache-2.0}
 * @version 2.0.0
 */
module.exports = class CypherTools {
    /**
     * This converts an object to a string that Neo4J can read. The object is
     * not a JSON object but essentially the same object with string quotes
     * around it. The key and value will be converted to a string via toString()
     * The key nor value will have quotes added around it, if you want the value
     * to be rendered as a string you must add quotes inside the string. See examples
     * below for better explanation.
     *
     * @public
     * @static
     * @method objToString
     * @summary
     * This converts an object to a string that Neo4J can read
     * @since 1.1.0
     * @param  {object} obj -
     * The object to return as a string
     * @return {string}
     * The Neo4J compatible stringified object
     * @example
     * // Converts a simple object to a string
     * let obj = {
     *     hello: 'world',
     *     key: 'value',
     *     device: 'laptop',
     *     test: 123
     * }
     *
     * let objStr = objToString(obj);
     *
     * // Returns
     * // `{ hello: `world`, key: `value`, device: `laptop`, test: 123 }`
     */
    static objToString(obj)
    {
        if(typeof obj !== `object`
            || _.isEmpty(obj)) return ``;

        // Start with blank string
        let objStr = ``;

        // Loop through each key/value pair on the string
        // Do a shallow loop as cypher doesnt support deeply nest objects
        // anyways
        _.forOwn(obj, (value, key) => {

            const tmpStr = `${key.toString()}: ${JSON.stringify(value)},`;

            // Append this to the other key/value's
            objStr = `${objStr} ${tmpStr}`;
        }, this);

        // Wrap object brackets around the whole string thus far
        objStr = `{ ${objStr} }`;

        // Take off trailing comma, cypher has no support for it
        // and thus it'll invalidate the query if left on
        objStr = objStr.replace(/\, \}$/, ` }`);

        // Return finished object
        return objStr;
    }

    /**
     * This is similar to objToString but more complicated and takes advantage
     * of Neo4J's parameters. objToParams will convert an object to a string
     * where the values of the object are variables that reference the same
     * object. The purpose of this is speed, optimization, and efficiency. Pass
     * the object to Neo4J as a parameter and then use this to convert the
     * object to a string where the values references the same object passed in
     * the parameter. Neo4J cant always just use the object as-is in the
     * parameters but in those cases it can reference the values if told to.
     * See examples below for better explanation
     *
     * @public
     * @static
     * @method objToParams
     * @summary This converts an object to a string where the values reference
     * the same object passed in as a parameter to Neo4J
     * @since 1.0.0
     * @param  {string} objName -
     * The name of the object parameter passed to Neo4J
     * @param  {object} obj -
     * The object to convert to a parameter string
     * @return {string}
     * The Neo4J compatible parameter string
     * @example
     * // Converts a simple object to a parameter string
     * let obj = {
     *     hello: `world`,
     *     key: `value`,
     *     device: `laptop`
     * }
     *
     * let objParam = cypherTools.objToParams(`param1`, obj);
     *
     * // Returns
     * // `{hello: {param1}.hello, key: {param1}.key, device: {param1}.device}`
     */
    static objToParams(objName, obj)
    {
        /*
         * Neo4J supports literal object parameters
         *
         * {
         *     key1: {obj}.key1
         *     key2: {obj}.key2
         * }
         *
         * So we need to convert an object to a string whereby the key names
         * are the same but the values reference the same object and its key
         */

        if(typeof objName !== `string`
            || typeof obj !== `object`
            || _.isEmpty(obj)) return ``;

        let newObj = ``;

        _.forOwn(obj, (value, key) => {
            // Convert key to string and make the value the object variable name
            // followed by access to the same key
            const tmpStr = `${key.toString()}: {${objName}}.${key.toString()},`;

            // Append this to the other key/value's
            newObj = `${newObj} ${tmpStr}`;
        });

        // Wrap object brackets around the whole string thus far
        newObj = `{ ${newObj} }`;

        // Take off trailing comma, cypher has no support for it
        // and thus it'll invalidate the query if left on
        newObj = newObj.replace(/\, \}$/, ` }`);

        // Return finished object
        return newObj;
    }

    /**
     * Converts an array of labels to string form that cypher can understand
     *
     * @public
     * @static
     * @method labelsToString
     * @since 1.1.0
     * @param  {array} labels -
     * Aray of labels
     * @return {string}
     * Labels in a string form that is compatible with cypher
     * @example
     * // Convert some labels to a label string
     * labelsToString([`Movie`, `Horror`, `Action`, `Favorite`]);
     * // Returns
     * // :Movie:Horror:Action:Favorite
     */
    static labelsToString(labels)
    {
        if(!Array.isArray(labels)
            || labels.length === 0) return ``;

        return `:${labels.join(`:`)}`;
    }
};
