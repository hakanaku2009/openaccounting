/*Copyright (C) 2015  Sao Tien Phong (http://saotienphong.com.vn)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
var cdpskh = require("../../libs/cdpskh");
var Customer = require("../../models/customer");
var underscore = require("underscore");
var controller = require("../../controllers/controllerRPT");
module.exports = function(router){
	var rpt = new controller(router,"cdpskh",function(req,callback){
		var query = req.query;
		//
		if(!query.tk || !query.tu_ngay || !query.den_ngay){
			return callback("Báo cáo này yêu cầu các tham số tk, tu_ngay,den_ngay");
		}
		//
		var id_app = query.id_app;
		cdpskh(query,function(error,report){
			if(error) return callback(error);
			report.joinModel(id_app,Customer,[
				{
					akey:'ma_kh',bkey:'ma_kh',
					fields:[
						{
							name:'ten_kh',
							value:'ten_kh'
						}
					]
				}
			],function(report){
				report.forEach(function(r){
					if(!r.ma_kh){
						r.ma_kh =undefined;
					}
				});
				report.push({ma_kh:'',ten_kh:'Tổng cộng'
							,dk_no:report.csum('dk_no')
							,dk_co:report.csum('dk_co')
							,ps_no:report.csum('ps_no')
							,ps_co:report.csum('ps_co')
							,ck_no:report.csum('ck_no')
							,ck_co:report.csum('ck_co')
							
							,dk_no_nt:report.csum('dk_no_nt')
							,dk_co_nt:report.csum('dk_co_nt')
							,ps_no_nt:report.csum('ps_no_nt')
							,ps_co_nt:report.csum('ps_co_nt')
							,ck_no_nt:report.csum('ck_no_nt')
							,ck_co_nt:report.csum('ck_co_nt')
							,systotal:1,bold:true
					}
				);
				
				var report = underscore.sortBy(report,function(r){
					return r.ma_kh;
				});
				callback(null,report);
			});
		});
	});
}