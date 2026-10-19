import { Cpu, Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw, Headphones, Facebook, Youtube, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTE_PATH } from '@/routes/route-path';

export default function Footer() {
    return (
        <footer className='border-t border-gray-200 bg-white text-gray-600'>
            {/* Value Highlights */}
            <div className='border-b border-gray-100 bg-slate-50/60 py-6'>
                <div className='container-page mx-auto grid grid-cols-2 gap-4 px-4 sm:grid-cols-4 sm:gap-6'>
                    <div className='flex items-center gap-3'>
                        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100/70 text-blue-600'>
                            <Truck className='h-5 w-5' />
                        </div>
                        <div>
                            <h4 className='text-xs font-bold text-gray-900 sm:text-sm'>Miễn Phí Vận Chuyển</h4>
                            <p className='text-xs text-gray-500'>Đơn hàng từ 500.000đ</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-3'>
                        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100/70 text-emerald-600'>
                            <ShieldCheck className='h-5 w-5' />
                        </div>
                        <div>
                            <h4 className='text-xs font-bold text-gray-900 sm:text-sm'>Bảo Hành 100%</h4>
                            <p className='text-xs text-gray-500'>Chính hãng 12 tháng</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-3'>
                        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100/70 text-amber-600'>
                            <RefreshCw className='h-5 w-5' />
                        </div>
                        <div>
                            <h4 className='text-xs font-bold text-gray-900 sm:text-sm'>Đổi Trả Dễ Dàng</h4>
                            <p className='text-xs text-gray-500'>Lỗi 1 đổi 1 trong 7 ngày</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-3'>
                        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100/70 text-purple-600'>
                            <Headphones className='h-5 w-5' />
                        </div>
                        <div>
                            <h4 className='text-xs font-bold text-gray-900 sm:text-sm'>Hỗ Trợ 24/7</h4>
                            <p className='text-xs text-gray-500'>Hotline: 1900 8888</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Links */}
            <div className='container-page mx-auto px-4 py-12'>
                <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
                    {/* Brand column */}
                    <div className='space-y-4'>
                        <Link to={ROUTE_PATH.HOME} className='flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-gray-900'>
                            <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'>
                                <Cpu className='h-5 w-5' />
                            </div>
                            <span>Tech<span className='text-blue-600'>Store</span></span>
                        </Link>
                        <p className='text-sm leading-relaxed text-gray-500'>
                            Hệ thống bán lẻ thiết bị công nghệ, smartphone, laptop và phụ kiện chính hãng hàng đầu Việt Nam.
                        </p>
                        <div className='space-y-2 text-sm text-gray-500'>
                            <div className='flex items-center gap-2'>
                                <MapPin className='h-4 w-4 shrink-0 text-blue-600' />
                                <span>Tầng 5, Tòa nhà Công Nghệ, Q. Cầu Giấy, Hà Nội</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <Phone className='h-4 w-4 shrink-0 text-blue-600' />
                                <span>Hotline: 1900 8888 (8:00 - 21:30)</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <Mail className='h-4 w-4 shrink-0 text-blue-600' />
                                <span>Email: support@techstore.vn</span>
                            </div>
                        </div>
                    </div>

                    {/* About TechStore */}
                    <div>
                        <h4 className='mb-4 text-sm font-bold uppercase tracking-wider text-gray-900'>Về Chúng Tôi</h4>
                        <ul className='space-y-2.5 text-sm'>
                            <li><Link to={ROUTE_PATH.HOME} className='hover:text-blue-600 transition-colors'>Giới thiệu TechStore</Link></li>
                            <li><Link to={ROUTE_PATH.HOME} className='hover:text-blue-600 transition-colors'>Hệ thống cửa hàng toàn quốc</Link></li>
                            <li><Link to={ROUTE_PATH.HOME} className='hover:text-blue-600 transition-colors'>Tin tức công nghệ mới</Link></li>
                            <li><Link to={ROUTE_PATH.HOME} className='hover:text-blue-600 transition-colors'>Cơ hội nghề nghiệp & Tuyển dụng</Link></li>
                            <li><Link to={ROUTE_PATH.HOME} className='hover:text-blue-600 transition-colors'>Liên hệ hợp tác doanh nghiệp</Link></li>
                        </ul>
                    </div>

                    {/* Customer Support */}
                    <div>
                        <h4 className='mb-4 text-sm font-bold uppercase tracking-wider text-gray-900'>Chính Sách & Hỗ Trợ</h4>
                        <ul className='space-y-2.5 text-sm'>
                            <li><Link to={ROUTE_PATH.HOME} className='hover:text-blue-600 transition-colors'>Chính sách bảo hành 12 tháng</Link></li>
                            <li><Link to={ROUTE_PATH.HOME} className='hover:text-blue-600 transition-colors'>Quy định đổi trả hàng trong 7 ngày</Link></li>
                            <li><Link to={ROUTE_PATH.HOME} className='hover:text-blue-600 transition-colors'>Chính sách bảo mật thông tin</Link></li>
                            <li><Link to={ROUTE_PATH.HOME} className='hover:text-blue-600 transition-colors'>Hướng dẫn mua hàng online</Link></li>
                            <li><Link to={ROUTE_PATH.HOME} className='hover:text-blue-600 transition-colors'>Tra cứu trạng thái đơn hàng</Link></li>
                        </ul>
                    </div>

                    {/* Payment & Social */}
                    <div>
                        <h4 className='mb-4 text-sm font-bold uppercase tracking-wider text-gray-900'>Phương Thức Thanh Toán</h4>
                        <div className='flex flex-wrap gap-2 text-xs font-semibold'>
                            <span className='rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-gray-700 shadow-xs'>COD (Tiền mặt)</span>
                            <span className='rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-blue-700 shadow-xs'>VNPay QR</span>
                            <span className='rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-pink-700 shadow-xs'>Ví MoMo</span>
                            <span className='rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-gray-700 shadow-xs'>Visa / Master</span>
                        </div>

                        <h4 className='mb-3 mt-6 text-sm font-bold uppercase tracking-wider text-gray-900'>Kết Nối Với Chúng Tôi</h4>
                        <div className='flex items-center gap-3'>
                            <a href='#' className='flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors hover:bg-blue-600 hover:text-white' title='Facebook'>
                                <Facebook className='h-4 w-4' />
                            </a>
                            <a href='#' className='flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-colors hover:bg-red-600 hover:text-white' title='Youtube'>
                                <Youtube className='h-4 w-4' />
                            </a>
                            <a href='#' className='flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-pink-600 transition-colors hover:bg-pink-600 hover:text-white' title='Instagram'>
                                <Instagram className='h-4 w-4' />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom line */}
                <div className='mt-10 border-t border-gray-100 pt-6 text-center text-xs text-gray-400'>
                    <p>© {new Date().getFullYear()} TechStore. Tất cả các quyền được bảo lưu. Thiết kế & phát triển bởi Team E-Commerce.</p>
                </div>
            </div>
        </footer>
    );
}
