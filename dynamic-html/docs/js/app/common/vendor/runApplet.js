/** HTML attribute filter implementation */
var hattrs = {
    core: [
      'id',
      'class',
      'title',
      'style'
    ],
    i18n: [
      'lang',
      'dir'
    ],
    events: [
      'onclick',
      'ondblclick',
      'onmousedown',
      'onmouseup',
      'onmouseover',
      'onmousemove',
      'onmouseout',
      'onkeypress',
      'onkeydown',
      'onkeyup'
    ],
    applet: [
      'codebase',
      'code',
      'name',
      'archive',
      'object',
      'width',
      'height',
      'alt',
      'align',
      'hspace',
      'vspace'
    ],
    object: [
      'classid',
      'codebase',
      'codetype',
      'data',
      'type',
      'archive',
      'declare',
      'standby',
      'height',
      'width',
      'usemap',
      'name',
      'tabindex',
      'align',
      'border',
      'hspace',
      'vspace'
    ]
  };
var object_valid_attrs = hattrs.object.concat(hattrs.core, hattrs.i18n, hattrs.events);
var applet_valid_attrs = hattrs.applet.concat(hattrs.core);
var applet_ready_flag = false;
function applet_ready() {
  applet_ready_flag = true;
  console.log('Angular applet flag called by Applet');
}
function arHas(ar, attr) {
  var len = ar.length;
  for (var i = 0; i < len; i++) {
    if (ar[i] === attr)
      return true;
  }
  return false;
}
function isValidAppletAttr(attr) {
  return arHas(applet_valid_attrs, attr.toLowerCase());
}
function isValidObjectAttr(attr) {
  return arHas(object_valid_attrs, attr.toLowerCase());
}
var writeAppletTag = function (attributes, parameters) {
  var startApplet = '<' + 'applet ';
  var params = '';
  var endApplet = '<' + '/' + 'applet' + '>';
  var addCodeAttribute = true;
  if (null == parameters || typeof parameters != 'object') {
    parameters = new Object();
  }
  for (var attribute in attributes) {
    if (!isValidAppletAttr(attribute)) {
      parameters[attribute] = attributes[attribute];
    } else {
      startApplet += ' ' + attribute + '="' + attributes[attribute] + '"';
      if (attribute == 'code') {
        addCodeAttribute = false;
      }
    }
  }
  var codebaseParam = false;
  for (var parameter in parameters) {
    if (parameter == 'codebase_lookup') {
      codebaseParam = true;
    }
    // Originally, parameter 'object' was used for serialized
    // applets, later, to avoid confusion with object tag in IE
    // the 'java_object' was added.  Plugin supports both.
    if (parameter == 'object' || parameter == 'java_object' || parameter == 'java_code') {
      addCodeAttribute = false;
    }
    params += '<param name="' + parameter + '" value="' + parameters[parameter] + '"/>';
  }
  if (!codebaseParam) {
    params += '<param name="codebase_lookup" value="false"/>';
  }
  if (addCodeAttribute) {
    startApplet += ' code="dummy"';
  }
  startApplet += '>';
  console.log(startApplet + '\n' + params + '\n' + endApplet);
  var retRes = startApplet + '\n' + params + '\n' + endApplet;
  return retRes;  //document.write(startApplet + '\n' + params + '\n' + endApplet);
};
//var template = writeAppletTag(attributes, parameters);
var writeTag = function (baseURL) {
  var attributes = {
      id: 'AppletAgent',
      width: 300,
      height: 150
    };
  var parameters = { jnlp_href: baseURL + 'MagicCliApplet.jnlp' };
  return writeAppletTag(attributes, parameters);
};