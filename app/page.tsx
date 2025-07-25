import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle } from 'lucide-react'

export default function LandingPage() {
	return (
		<div className="min-h-screen flex flex-col">
			{/* Navigation */}
			<header className="border-b">
				<div className="container mx-auto px-4 py-4 flex justify-between items-center">
					<div className="flex items-center space-x-2">
						<div className="w-8 h-8 rounded-full bg-[#8FD694] flex items-center justify-center">
							<span className="text-white font-bold">In</span>
						</div>
						<span className="font-bold text-xl">job</span>
					</div>
					<div className="flex items-center space-x-4">
						<Link
							href="/login"
							className="text-sm text-gray-600 hover:text-gray-900"
						>
							로그인
						</Link>
						<Button
							variant="outline"
							className="text-sm border-[#8FD694] text-[#8FD694] hover:bg-[#8FD694] hover:text-white"
						>
							회원가입
						</Button>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="py-20 px-4">
				<div className="container mx-auto max-w-5xl">
					<div className="flex flex-col md:flex-row items-center">
						<div className="md:w-1/2 mb-10 md:mb-0">
							<h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
								AI 모의 면접으로
								<br />
								취업을 준비하세요
							</h1>
							<p className="text-xl text-gray-600 mb-8">
								자기소개서 업로드부터, AI 피드백까지 한 번에
							</p>
							<Button className="px-8 py-6 bg-[#8FD694] hover:bg-[#7ac47f] text-white rounded-lg text-lg font-medium">
								시작하기 <ArrowRight className="ml-2 h-5 w-5" />
							</Button>
						</div>
						<div className="md:w-1/2 md:pl-10">
							<div className="relative">
								<div className="absolute -inset-1 bg-[#8FD694] opacity-10 rounded-xl"></div>
								<div className="relative bg-white p-6 rounded-xl shadow-sm border border-gray-100">
									<img
										src="/placeholder.svg?height=300&width=400"
										alt="AI Interview Demo"
										className="w-full rounded-lg"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="py-16 bg-gray-50">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold text-center mb-12">주요 기능</h2>
					<div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
						{[
							{
								title: 'AI 면접관',
								description:
									'실제 면접과 유사한 질문과 대화를 통해 실전 감각을 키웁니다.',
							},
							{
								title: '실시간 피드백',
								description:
									'답변 직후 즉각적인 피드백으로 개선점을 바로 확인할 수 있습니다.',
							},
							{
								title: '자기소개서 분석',
								description:
									'업로드한 자기소개서를 기반으로 맞춤형 질문을 생성합니다.',
							},
						].map((feature, index) => (
							<div
								key={index}
								className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
							>
								<div className="w-12 h-12 bg-[#8FD694] bg-opacity-20 rounded-full flex items-center justify-center mb-4">
									<CheckCircle className="h-6 w-6 text-[#8FD694]" />
								</div>
								<h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
								<p className="text-gray-600">{feature.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Testimonial Section */}
			<section className="py-16">
				<div className="container mx-auto px-4 max-w-4xl">
					<div className="bg-[#8FD694] bg-opacity-10 p-8 rounded-2xl">
						<div className="flex flex-col items-center text-center">
							<p className="text-xl italic mb-6">
								"Injob AI 덕분에 자신감을 얻고 실제 면접에서도 좋은 결과를 얻을
								수 있었습니다. 특히 피드백이 구체적이어서 많은 도움이 되었어요."
							</p>
							<div className="flex items-center">
								<div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
								<div>
									<p className="font-medium">김지원</p>
									<p className="text-sm text-gray-600">서울대학교 경영학과</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="mt-auto py-8 bg-gray-50 border-t">
				<div className="container mx-auto px-4">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<div className="flex items-center space-x-2 mb-4 md:mb-0">
							<div className="w-6 h-6 rounded-full bg-[#8FD694] flex items-center justify-center">
								<span className="text-white font-bold text-xs">AI</span>
							</div>
							<span className="font-bold">Injob</span>
						</div>
						<div className="flex space-x-6 text-sm text-gray-600">
							<Link href="/about" className="hover:text-gray-900">
								회사 소개
							</Link>
							<Link href="/terms" className="hover:text-gray-900">
								이용약관
							</Link>
							<Link href="/privacy" className="hover:text-gray-900">
								개인정보처리방침
							</Link>
							<Link href="/contact" className="hover:text-gray-900">
								문의하기
							</Link>
						</div>
					</div>
					<div className="text-center mt-6 text-sm text-gray-500">
						© {new Date().getFullYear()} Injob AI. All rights reserved.
					</div>
				</div>
			</footer>
		</div>
	)
}
