import React, { useEffect, useState, useMemo } from 'react';
import { Zap, Search, Shield, Workflow, Video, Upload } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import {
  getTranslations,
  getTranslationValue,
  buildReverseTranslationMap,
  translateMaybe
} from '../utils/translation';

export default function VideoDemo() {
  const { isFrench } = useLanguage();
  const { content } = useContent();
  const [isVisible, setIsVisible] = useState(false);

  const translations = getTranslations(isFrench);
  const t = (key, defaultValue = '') => getTranslationValue(translations, key, defaultValue);

  const reverseMap = useMemo(() => buildReverseTranslationMap(), []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const videoContent = content.video || {};
  const videoUrl = videoContent.video_url || '';
  const videoImage = videoContent.image_url || '';

  const headerTitle = translateMaybe(videoContent.title, isFrench, reverseMap, t('videoDemo.title', 'See It In Action'));
  const headerSubtitle = translateMaybe(
    videoContent.subtitle,
    isFrench,
    reverseMap,
    t('videoDemo.subtitle', 'Watch how SearchEngine transforms document management with intelligent workflows')
  );

  const emptyMessage = translateMaybe(
    videoContent.content,
    isFrench,
    reverseMap,
    t('videoDemo.noVideoMessage', "Add your demo video to showcase the platform's features and user experience")
  );

  return (
    <section id="video" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-br from-slate-50 to-green-50">
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-8 sm:mb-12 md:mb-16 transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-100 rounded-full text-green-700 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {t('videoDemo.tagline', 'Platform Demonstration')}
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            {headerTitle}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            {headerSubtitle}
          </p>
        </div>

        <div className={`bg-white rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="aspect-video bg-gradient-to-br from-slate-900 to-gray-900 relative">
            {videoUrl ? (
              <>
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full object-contain"
                  poster={videoImage || '/images/video-poster.jpg'}
                />
                <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-black/70 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                  <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5" />
                  {t('videoDemo.demoVideo', 'Demo Video')}
                </div>
              </>
            ) : videoImage ? (
              <div className="relative w-full h-full">
                <img src={videoImage} alt="Video thumbnail" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-4">
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4 sm:mb-6 flex items-center justify-center group hover:scale-110 transition-transform cursor-pointer"
                    onClick={() => {
                      if (localStorage.getItem('adminToken')) {
                        window.open('/admin/content?section=video', '_blank');
                      }
                    }}
                  >
                    <Video className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                  </div>

                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 text-center">
                    {t('videoDemo.noVideoTitle', 'Demo Video')}
                  </h3>

                  <p className="text-gray-200 text-sm sm:text-base mb-4 sm:mb-6 max-w-md text-center">
                    {emptyMessage}
                  </p>

                  {localStorage.getItem('adminToken') && (
                    <a
                      href="/admin/content?section=video"
                      className="px-4 py-2 sm:px-6 sm:py-3 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition font-medium flex items-center gap-2 text-sm sm:text-base"
                    >
                      <Upload className="w-4 h-4" />
                      {t('videoDemo.adminUploadVideo', 'Upload Video in Admin Panel')}
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-8 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4 sm:mb-6 flex items-center justify-center group hover:scale-110 transition-transform">
                  <Video className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                </div>

                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {t('videoDemo.noVideoTitle', 'Demo Video')}
                </h3>

                <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 max-w-md">
                  {emptyMessage}
                </p>

                {localStorage.getItem('adminToken') && (
                  <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200 max-w-md">
                    <p className="text-green-700 text-sm sm:text-base">
                      <strong>{t('common.admin', 'Admin')}:</strong> {t('videoDemo.admin', 'Upload demo videos in Content Editor → Video Section')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-4 sm:p-6 md:p-8 bg-white border-t border-green-100">
            <div className="grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {[
                {
                  icon: <Search className="w-5 h-5 sm:w-6 sm:h-6" />,
                  title: t('videoDemo.smartSearch', 'Smart Search'),
                  description: t('videoDemo.smartSearchDesc', 'AI-powered document discovery'),
                  color: 'from-blue-500 to-blue-600'
                },
                {
                  icon: <Workflow className="w-5 h-5 sm:w-6 sm:h-6" />,
                  title: t('videoDemo.workflows', 'Workflows'),
                  description: t('videoDemo.workflowsDesc', 'Automated processes'),
                  color: 'from-green-500 to-emerald-600'
                },
                {
                  icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6" />,
                  title: t('videoDemo.security', 'Security'),
                  description: t('videoDemo.securityDesc', 'Enterprise-grade protection'),
                  color: 'from-purple-500 to-purple-600'
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`text-center group transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br ${feature.color} rounded-xl sm:rounded-2xl mx-auto mb-3 sm:mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h5 className="font-semibold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">{feature.title}</h5>
                  <p className="text-gray-600 text-xs sm:text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
