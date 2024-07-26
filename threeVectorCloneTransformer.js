"use strict";
/*
 * This file is licensed under the MIT License.
 * Copyright 2020 twinkfrag
 * Repository: https://github.com/twinkfrag/three-vector-auto-clone
 */
exports.__esModule = true;
var ts = require("typescript");
var path = require("path");
// "import(*)"を除いたTypeName
var regex_typename = new RegExp(/^(?:import\(.*?\)\.)?(.*)$/);
// エントリーポイントより外側(node_modules等)を除外
var regex_filename = new RegExp(/^(?!\.{2}).*/);
var requireCloneClasses = [
    "THREE.Vector2",
    "THREE.Vector3",
    "THREE.Vector4",
];
// setXXを除いた，thisを返すメンバを指定
var requireCloneMembers = [
    "add",
    "addScalar",
    "addScaledVector",
    "addVectors",
    "sub",
    "subScalar",
    "subVectors",
    "multiply",
    "multiplyScalar",
    "multiplyVectors",
    "divide",
    "divideScalar",
    "applyEuler",
    "applyAxisAngle",
    "applyMatrix3",
    "applyNormalMatrix",
    "applyMatrix4",
    "applyQuaternion",
    "project",
    "unproject",
    "transformDirection",
    "min",
    "max",
    "clamp",
    "clampScalar",
    "clampLength",
    "floor",
    "ceil",
    "round",
    "roundToZero",
    "negate",
    "normalize",
    "lerp",
    "lerpVectors",
    "rotateAround",
    "cross",
    "crossVectors",
    "projectOnVector",
    "projectOnPlane",
    "reflect",
];
var transformerFactory = function (program) { return function (context) {
    var checker = program.getTypeChecker();
    var visitor = function (node) {
        // 現在処理中のsourceFileを取るがundefinedなことがある
        var sourceFile = node.getSourceFile();
        if (sourceFile && regex_filename.test(path.relative(program.getCurrentDirectory(), sourceFile.fileName))) {
            if (node.kind === ts.SyntaxKind.PropertyAccessExpression) {
                var exp = node;
                var type = checker.getTypeAtLocation(exp.expression);
                if (requireCloneClasses.includes(regex_typename.exec(checker.typeToString(type, undefined, ts.TypeFormatFlags.UseFullyQualifiedType))[1])) {
                    if (requireCloneMembers.includes(exp.name.text)) {
                        node = ts.createPropertyAccess(ts.createCall(ts.createPropertyAccess(exp.expression, ts.createIdentifier("clone")), undefined, []), exp.name);
                    }
                }
            }
        }
        return ts.visitEachChild(node, visitor, context);
    };
    return function (node) { return ts.visitNode(node, visitor); };
}; };
exports["default"] = transformerFactory;
