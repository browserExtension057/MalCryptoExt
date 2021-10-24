
//*****************************************************************************}
//                                                                             }
//       Sticky Password Autofill Engine                                       }
//       Chromium Module Loader                                                }
//                                                                             }
//       Copyright (C) 2015 Lamantine Software a.s.                            }
//                                                                             }
//*****************************************************************************}

function spDefine(AModuleName, ExportObject)
{
  spRequire.scopes[AModuleName] = ExportObject;
}

function spRequire(AModuleName)
{
  return spRequire.scopes[AModuleName];
}

spRequire.scopes = Object.create(null);