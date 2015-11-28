/*
    Copyright 2015 John Mothershed

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
 */

var cypherTools = require("../build");

describe("Simple tests", function()
{
    it("should stringify object correctly", function()
    {
        var objStr = cypherTools.objToString({
            hello: '"world"',
            whats: '"cooking"',
            test: 123
        });

        expect(objStr).toEqual('{  hello: "world", whats: "cooking", test: 123 }');
    });

    it("should convert object to parameters correctly", function()
    {
        var objParam = cypherTools.objToParams("coolObject", {
            hello: 'world',
            whats: 'cooking',
            test: 123
        });

        expect(objParam).toEqual('{  hello: {coolObject}.hello, whats: {coolObject}.whats, test: {coolObject}.test }');
    });

    it("labels to string", function()
    {
        var labelStr = cypherTools.labelsToString(["Movie", "Horror"]);
        expect(labelStr).toEqual(":Movie:Horror");
    });
});
