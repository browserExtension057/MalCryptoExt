// Copyright (c) 2014-2015, MyBittube.com
// 
// All rights reserved.
// 
// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:
// 
// 1. Redistributions of source code must retain the above copyright notice, this list of
//    conditions and the following disclaimer.
// 
// 2. Redistributions in binary form must reproduce the above copyright notice, this list
//    of conditions and the following disclaimer in the documentation and/or other
//    materials provided with the distribution.
// 
// 3. Neither the name of the copyright holder nor the names of its contributors may be
//    used to endorse or promote products derived from this software without specific
//    prior written permission.
// 
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
// THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
// STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
// THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

thinwalletDirectives.directive('qrCode', function() {
    return {
        scope: {
            value: '='
        },
        link: function(scope, element, attrs) {
            var qrcode = new QRCode(element[0], {
                width: 110,
                height: 110,
                correctLevel: QRCode.CorrectLevel.L
            });

            function updateQrCode() {
                scope.qrcodeaddress= attrs.integratedAddress;
                qrcode.makeCode("bittube:" + scope.qrcodeaddress);
            }

            updateQrCode();

            // document.getElementById('integrated-address').addEventListener('change', function(){
            //     console.log(this.value);
            // })
            document.getElementById('generate_new_id').addEventListener('click', function(e){
                //Wait 50ms to make sure the attribute has been updated already
                setTimeout(() => {
                    updateQrCode();
                }, 50);
            });

            document.getElementById('payment_id8').addEventListener('keyup', function(e){
                //Wait 50ms to make sure the attribute has been updated already
                setTimeout(() => {
                    updateQrCode();
                }, 50);
            });
        }
    };
});