import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';

// 获取 enStr、sKey
export async function accpApi(params) {
  return request(`${_baseApi}/parkingConsultant/accp`, {
    method: 'POST',
    body: params,
  });
}

// 获取 随机因子
export async function getRandomApi(params) {
  return request(`${_baseApi}/parkingConsultant/getRandom`, {
    method: 'POST',
    body: params,
  });
}

// 连连支付 key，固定值不可更改，替换成模板字符串无效。
let public_key = '-----BEGIN CERTIFICATE-----\n';
public_key += 'MIIFlTCCBH2gAwIBAgIQYTC2Vefifv0qr9D6R/ga6TANBgkqhkiG9w0BAQUFADCB\n';
public_key += 'vDELMAkGA1UEBhMCVVMxFzAVBgNVBAoTDlZlcmlTaWduLCBJbmMuMR8wHQYDVQQL\n';
public_key += 'ExZWZXJpU2lnbiBUcnVzdCBOZXR3b3JrMTswOQYDVQQLEzJUZXJtcyBvZiB1c2Ug\n';
public_key += 'YXQgaHR0cHM6Ly93d3cudmVyaXNpZ24uY29tL3JwYSAoYykxMDE2MDQGA1UEAxMt\n';
public_key += 'VmVyaVNpZ24gQ2xhc3MgMyBJbnRlcm5hdGlvbmFsIFNlcnZlciBDQSAtIEczMB4X\n';
public_key += 'DTEzMDMxMjAwMDAwMFoXDTE3MDUxMDIzNTk1OVowgcoxCzAJBgNVBAYTAkNOMREw\n';
public_key += 'DwYDVQQIEwhaaGVqaWFuZzERMA8GA1UEBxQISGFuZ3pob3UxNjA0BgNVBAoULUxp\n';
public_key += 'YW5saWFuIFlpbnRvbmcgRWxlY3Ryb25pYyBQYXltZW50IENvLiwgTHRkLjEPMA0G\n';
public_key += 'A1UECxQGUGF5IElUMTMwMQYDVQQLFCpUZXJtcyBvZiB1c2UgYXQgd3d3LnZlcmlz\n';
public_key += 'aWduLmNvbS9ycGEgKGMpMDUxFzAVBgNVBAMUDnlpbnRvbmcuY29tLmNuMIIBIjAN\n';
public_key += 'BgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzjKcwzzLuErydolRM9wAU5spZwJp\n';
public_key += '1qkWjIxkuF+/oHsdrziTBMgjkvYA4Xl0BmBdwyycfHLJxvzv5QlGV3QNERdSCiUS\n';
public_key += 'l3Vg3flhgvqI+rQSyNmHB3dfwwCoAiEc8Lahi9XV+QvfKQMU6JcwLpCz0oOmgqWn\n';
public_key += 'bdJ8k9hzql4WktS6EdAI1FBodFPV9L/JexnjjJBdjcPvw5PACaCKxW+wRc0m8s0/\n';
public_key += '9dCT9cc0wz+XLAzW83WFViysxkPn0HuOCWwLbV1jbYjBbn3Te40FQXiX8ir/EmBi\n';
public_key += 'b0QFnNedZd1tdNdPxzxKJpZze0WEMktZm7FGr7REPpQXPwXKL/OOPzHnpQIDAQAB\n';
public_key += 'o4IBgTCCAX0wGQYDVR0RBBIwEIIOeWludG9uZy5jb20uY24wCQYDVR0TBAIwADAO\n';
public_key += 'BgNVHQ8BAf8EBAMCBaAwQwYDVR0gBDwwOjA4BgpghkgBhvhFAQc2MCowKAYIKwYB\n';
public_key += 'BQUHAgEWHGh0dHBzOi8vd3d3LnZlcmlzaWduLmNvbS9jcHMwQQYDVR0fBDowODA2\n';
public_key += 'oDSgMoYwaHR0cDovL1NWUkludGwtRzMtY3JsLnZlcmlzaWduLmNvbS9TVlJJbnRs\n';
public_key += 'RzMuY3JsMCgGA1UdJQQhMB8GCCsGAQUFBwMBBggrBgEFBQcDAgYJYIZIAYb4QgQB\n';
public_key += 'MB8GA1UdIwQYMBaAFNebfNgioBX33a1fzimbWMO8RgC1MHIGCCsGAQUFBwEBBGYw\n';
public_key += 'ZDAkBggrBgEFBQcwAYYYaHR0cDovL29jc3AudmVyaXNpZ24uY29tMDwGCCsGAQUF\n';
public_key += 'BzAChjBodHRwOi8vU1ZSSW50bC1HMy1haWEudmVyaXNpZ24uY29tL1NWUkludGxH\n';
public_key += 'My5jZXIwDQYJKoZIhvcNAQEFBQADggEBAHt/lILCrLbxDQzn92MUaSRfwoZ6rSaM\n';
public_key += 'lAyTCkXabgBkut8x1H0CYlQcdZlJ1W/7PVpt9i5YQ9mkMJTNFfzWoHLX/BOk7Rle\n';
public_key += 'aD0Eg6TA5J8zwX6wPxWfxwY/S3PgV5jYBdfBTcN3QpCzbPNYCdb7XK+m7xBPRj/K\n';
public_key += 'e7FL3vB5mzFBQoIkoIZ90TZ8B4bTEUta6BC2Wl7/JLuZZR95zWHcmzYU6swSYGql\n';
public_key += 'VwWVMh4LYvUYHDbaj8aQDFpq1jNXuCUHpO7y6RFY6XKoR9vvLAgpvPfUZI9ugVDw\n';
public_key += '0Po/deEDBpqwZx4N+nUsXHIA+ohC05gX4TJe+xJeErQnUN1+5sg1MBA=\n';
public_key += '-----END CERTIFICATE-----';

const public_key_convert =
  '3082010a0282010100ce329cc33ccbb84af276895133dc00539b29670269d6a9168c8c64b85fbfa07b1daf389304c82392f600e1797406605dc32c9c7c72c9c6fcefe5094657740d1117520a2512977560ddf96182fa88fab412c8d98707775fc300a802211cf0b6a18bd5d5f90bdf290314e897302e90b3d283a682a5a76dd27c93d873aa5e1692d4ba11d008d450687453d5f4bfc97b19e38c905d8dc3efc393c009a08ac56fb045cd26f2cd3ff5d093f5c734c33f972c0cd6f37585562cacc643e7d07b8e096c0b6d5d636d88c16e7dd37b8d05417897f22aff1260626f44059cd79d65dd6d74d74fc73c4a2696737b4584324b599bb146afb4443e94173f05ca2ff38e3f31e7a50203010001';

export const keyJson = {
  public_key,
  public_key_convert,
};
