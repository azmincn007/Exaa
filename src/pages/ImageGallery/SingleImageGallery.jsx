import { BsDownload } from "react-icons/bs";
import { IoAlertCircleOutline } from "react-icons/io5";
import { PiShareFill } from "react-icons/pi";
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { BASE_URL } from "../../config/config";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useState, useMemo } from 'react';
import ReportModal from "./Modal/ReportModal";
import { FaWhatsapp, FaFacebook } from 'react-icons/fa';
import { MdContentCopy } from 'react-icons/md';
import { useToast } from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { ZoomIn, ZoomOut, X } from 'lucide-react';
import { Modal, ModalOverlay, ModalContent, ModalBody } from '@chakra-ui/react';

export default function SingleImageGallery() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const imageId = searchParams.get('imageId');
    const [showMenu, setShowMenu] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const toast = useToast();
    const [isGalleryView, setIsGalleryView] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const { data: imageData, isLoading, error } = useQuery({
        queryKey: ['gallery-image', id, imageId],
        queryFn: async () => {
            const response = await fetch(`${BASE_URL}/api/find-one-image-gallery-image/${id}?imageId=${imageId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch image');
            }
            const data = await response.json();
            return data.data;
        },
        enabled: !!id && !!imageId,
    });

    const { data: relatedImages } = useQuery({
        queryKey: ['related-images', imageData?.imageGalleryCategory?.id, imageData?.id, imageData?.imageGallerySubCategory?.id],
        queryFn: async () => {
            const response = await fetch(
                `${BASE_URL}/api/find-image-gallery-related-images/${imageData.imageGalleryCategory.id}?imageId=${imageData.id}&imageGallerySubCategoryId=${imageData.imageGallerySubCategory.id}`
            );
            if (!response.ok) {
                throw new Error('Failed to fetch related images');
            }
            const data = await response.json();
            console.log(data.data);
            return data.data;
        },
        enabled: !!imageData?.imageGalleryCategory?.id && !!imageData?.id && !!imageData?.imageGallerySubCategory?.id,
    });

    const handleDownload = async () => {
        try {
            const response = await fetch(`${BASE_URL}${imageData.url}`);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = imageData.title 
                ? `${imageData.title.replace(/[^a-z0-9]/gi, '_')}.${blob.type.split('/')[1]}` 
                : 'downloaded_image';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Download failed:', error);
            toast({
                title: 'Error',
                description: 'Failed to download image',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleReport = () => {
        console.log('Reported reason:', reportReason);
        setIsReportModalOpen(false);
    };

    const handleCopyLink = async () => {
        try {
            const currentUrl = window.location.href;
            await navigator.clipboard.writeText(currentUrl);
            toast({
                title: 'Success',
                description: 'Link copied to clipboard!',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top'
            });
            setShowShareMenu(false);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to copy link',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top'
            });
        }
    };

    const handleWhatsAppShare = () => {
        const currentUrl = window.location.href;
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(currentUrl)}`;
        window.open(whatsappUrl, '_blank');
        setShowShareMenu(false);
    };

    const handleFacebookShare = () => {
        const currentUrl = window.location.href;
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        window.open(facebookUrl, '_blank');
        setShowShareMenu(false);
    };

    const handleRelatedImageClick = (newImageId) => {
        navigate(`?imageId=${newImageId}`);
    };

    const handleShareMenuToggle = () => {
        setShowShareMenu(prev => !prev);
        setShowMenu(false);
    };

    const allImages = useMemo(() => {
        if (!imageData) return [];
        return [imageData, ...(relatedImages || [])];
    }, [imageData, relatedImages]);

    const handleZoomIn = () => {
        setZoomLevel(prev => Math.min(prev + 0.5, 3)); // Max zoom 3x
    };

    const handleZoomOut = () => {
        setZoomLevel(prev => Math.max(prev - 0.5, 1)); // Min zoom 1x
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };

    const handleMouseMove = (e) => {
        if (isDragging && zoomLevel > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleModalClose = () => {
        setIsFullScreen(false);
        setZoomLevel(1);
        setPosition({ x: 0, y: 0 }); // Reset position when modal closes
    };

    if (isLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="h-48 md:h-[50%] my-auto w-[50%] mx-auto bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
        );
    }

    if (error) {
        return <div className="w-full h-screen flex items-center justify-center text-red-500">Error: {error.message}</div>;
    }

    return (
        <div className="w-full mx-auto p-4 md:p-8 max-w-[95%]">
            <div className="rounded-lg overflow-hidden flex flex-col relative">
                {/* Main Image Section */}
                <div className="relative">
                    <div className="absolute top-4 right-4 z-10">
                        <button 
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                        >
                            <BsThreeDotsVertical className="text-xl" />
                        </button>
                        
                        {/* Menu Options */}
                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-20 border border-gray-100 text-14">
                                <button
                                    onClick={handleShareMenuToggle}
                                    className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100"
                                >
                                    <PiShareFill className="text-gray-600" />
                                    <span>Share</span>
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100"
                                >
                                    <BsDownload className="text-gray-600" />
                                    <span>Download</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setIsReportModalOpen(true);
                                        setShowMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100"
                                >
                                    <IoAlertCircleOutline className="text-red-500" />
                                    <span>Report</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <div 
                        className="flex-grow flex items-center justify-center bg-gray-100 min-h-[50vh] cursor-pointer"
                        onClick={() => setIsFullScreen(true)}
                    >
                        <img 
                            src={`${BASE_URL}${imageData.url}`} 
                            alt={imageData.title} 
                            className="max-h-[80vh] max-w-full w-auto h-auto object-contain"
                        />
                    </div>
                </div>

                {/* Image Details */}
                <div className="p-4 ">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <h3 className="text-lg font-medium">{imageData?.title}</h3>
                            <p className="text-sm text-gray-500">{imageData?.category}</p>
                            <p className="text-sm text-gray-500">{imageData?.subCategory}</p>
                        </div>
                    </div>
                </div>

                {/* Related Images Section */}
                {relatedImages && relatedImages.length > 0 && (
    <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 px-4">Related Images</h3>
        <Swiper
            spaceBetween={20}
            slidesPerView={3}
            breakpoints={{
                320: { slidesPerView: 1. },
                640: { slidesPerView: 3.5 },
                768: { slidesPerView: 4.5 },
            }}
            className="px-4"
        >
            {relatedImages.map((image) => (
                <SwiperSlide key={image.id}>
                    <div 
                        className="cursor-pointer"
                        onClick={() => handleRelatedImageClick(image.imageId)}
                    >
                        <div className="relative pb-[56.25%]">
                            <img
                                src={`${BASE_URL}${image.url}`}
                                alt={image.title}
                                className="absolute inset-0 w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity"
                            />
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    </div>
)}
            </div>

            {/* Report Modal */}
            <ReportModal 
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                reportReason={reportReason}
                setReportReason={setReportReason}
                onReport={handleReport}
                imageId={imageData?.id}
                imageGallerySubCategory={imageData?.imageGallerySubCategory?.id}
            />

            {/* Share Menu Modal */}
            {showShareMenu && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white rounded-lg p-6 w-80 max-w-[90%]">
                        <h3 className="text-lg font-medium mb-4">Share Image</h3>
                        <div className="space-y-4">
                            <button
                                onClick={handleWhatsAppShare}
                                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100"
                            >
                                <FaWhatsapp className="text-green-500 text-xl" />
                                <span>Share on WhatsApp</span>
                            </button>
                            <button
                                onClick={handleFacebookShare}
                                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100"
                            >
                                <FaFacebook className="text-blue-600 text-xl" />
                                <span>Share on Facebook</span>
                            </button>
                            <button
                                onClick={handleCopyLink}
                                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100"
                            >
                                <MdContentCopy className="text-gray-600 text-xl" />
                                <span>Copy Link</span>
                            </button>
                        </div>
                        <button
                            onClick={() => setShowShareMenu(false)}
                            className="mt-4 w-full px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Full Screen Image Modal */}
            <Modal isOpen={isFullScreen} onClose={handleModalClose} size="full">
                <ModalOverlay />
                <ModalContent>
                    <div className="absolute top-4 right-4 flex gap-3 z-50">
                        <button
                            onClick={handleZoomIn}
                            className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors text-white"
                            title="Zoom In"
                        >
                            <ZoomIn size={24} />
                        </button>
                        <button
                            onClick={handleZoomOut}
                            className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors text-white"
                            title="Zoom Out"
                        >
                            <ZoomOut size={24} />
                        </button>
                        <button
                            onClick={handleModalClose}
                            className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors text-white"
                            title="Close"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <ModalBody 
                        className="flex justify-center items-center bg-black/90 overflow-hidden"
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onMouseMove={handleMouseMove}
                    >
                        <img
                            src={`${BASE_URL}${imageData.url}`}
                            alt={imageData.title}
                            className="max-h-[90vh] max-w-[90vw] object-contain select-none"
                            style={{ 
                                transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
                                cursor: zoomLevel > 1 ? 'grab' : 'default',
                                transition: isDragging ? 'none' : 'transform 0.2s',
                            }}
                            onMouseDown={handleMouseDown}
                            draggable={false}
                        />

                        <div className="absolute bottom-8 right-8 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                            {(zoomLevel * 100).toFixed(0)}%
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
}