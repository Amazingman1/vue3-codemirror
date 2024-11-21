
interface KeywordInterface {
  label: string;
  type: string;
  apply: string;
  detail: string;
}
/**
 * 逻辑函数
 *
 */
export const DEFINFUN:KeywordInterface[] = [
  {label: "IF", type: "function", apply: "if( [[条件]] ){\n  [[方法体]] }" , detail: "判断函数"},
  {label: "TRY", type: "function", apply: "try{\n  [[方法体]] }\n catch(Exception e){\n [[异常处置]]}" , detail: "异常捕捉函数"}
]

/**
 * 数值函数
 *
 */

export const MATHFUN: KeywordInterface[] = [
  {label: "MAX", type: "function", apply: "max( [[变量1]],  [[变量2]] )" , detail: "求最大值"},
  {label: "MIN", type: "function", apply: "min( [[变量1]],  [[变量2]] )" , detail: "求最小值"},
  {label: "INT", type: "function", apply: "int( [[变量]])" , detail: "取整，向下取整"},
  {label: "ABS", type: "function", apply: "abs( [[变量]] )" , detail: "还回参数绝对值"},
]


/**
 * 日期函数
 *
 */
 export const DATEFUN: KeywordInterface[] = [
  {label: "DATE", type: "function", apply: "date()" , detail: "获取当前时间"}
]

/**
 * 文本函数
 *
 */
 export const TEXTFUN: KeywordInterface[] = [
  {label: "LEN", type: "function", apply: "len( [[变量]] )" , detail: "计算出字符数"}
]

/**
 * 其他函数
 *
 */
 export const OTHERFUN: KeywordInterface[] = [
  {label: "ISNULL", type: "function", apply: "isnull( [[变量]] )" , detail: "判断是否为空值"}
]

// 普通变量
export const CUSTOMVAR:KeywordInterface[] = [
  {label: "sex", type: "variable", apply: "@[[变量.sex]]", detail: "性别"},
  {label: "name", type: "variable", apply: "@[[变量.name]]", detail: "姓名"},
  {label: "user.age", type: "variable", apply: "@[[变量.age]]", detail: "年龄"},
  {label: "model.credit_score", type: "variable", apply: "@[[变量.credit_score]]", detail: "信用分"},
  {label: "user.credit_limit", type: "variable", apply: "@[[变量.credit_limit]]", detail: "额度"}
]
// 参数变量
export const PARAMVAR:KeywordInterface[] = [
  {label: "par.sex", type: "variable", apply: "@[[参数.sex]]", detail: "性别"},
  {label: "par.age", type: "variable", apply: "@[[参数.age]]", detail: "年龄"},
]
// 组件变量
export const COMPVAR:KeywordInterface[] = [
  {label: "com.sex", type: "variable", apply: "@[[组件.sex]]", detail: "性别"},
  {label: "com.age", type: "variable", apply: "@[[组件.age]]", detail: "年龄"},
]

// 模型变量
export const MODVAR:KeywordInterface[] = [
  {label: "mod.sex", type: "variable", apply: "@[[模型.sex]]", detail: "性别"},
  {label: "mod.age", type: "variable", apply: "@[[模型.age]]", detail: "年龄"},
]
/**
 * 判断是否为存在的变量
 */
export function hasParam(param: string){
  const arr = VARLIST.map(item => item.apply === param ? item.apply : null).filter(item => item)
  return arr.length > 1
}
/**
 * description:变量列表
 */
export const VARLIST = CUSTOMVAR.concat(PARAMVAR).concat(COMPVAR).concat(MODVAR)

/**
 * description:关键字联想
 */

export const DEFINKEY = ():KeywordInterface[] =>{
  var javaParam: KeywordInterface[] = []
  let javakey = ["abstract","assert","boolean","break","byte","case","catch","char","class","const"];
  javakey = javakey.concat(["continue","default","do","double","else","enum","extends","final","finally","float"]);
  javakey = javakey.concat(["for","goto","if","implements","import","instanceof","int","interface","long","native"]);
  javakey = javakey.concat(["new","package","private","protected","public","record","return","strictfp","short","static"]);
  javakey = javakey.concat(["super","switch","synchronized","this","throw","throws","transient","try","void","volatile"]);
  javakey = javakey.concat(["while","String"]);
  for(var i= 0; i < javakey.length; i++){
    var param: KeywordInterface = {label: javakey[i], type: "keyword", apply: "[[" + javakey[i] + "]]", detail: javakey[i]};
    javaParam.push(param);
  }
  return javaParam;
}

export const FUNLIST = DEFINFUN.concat(MATHFUN).concat(DATEFUN).concat(TEXTFUN).concat(OTHERFUN)

/**
 * description:联想列表
 */
export const DEFINALL = DEFINKEY().concat(VARLIST).concat(FUNLIST)

