package jvbz.boot.vss.inquiry.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.inject.Inject;
import jvbz.boot.vss.inquiry.entity.Inquiry;
import jvbz.boot.vss.inquiry.repository.InquiryRepository;

@Service
public class InquiryService {
	@Inject
	private InquiryRepository inquiryRepository;
	
	@Transactional
	public Inquiry saveInquiry(Inquiry inquiry) {
		return inquiryRepository.save(inquiry);
	}
	
	@Transactional(readOnly = true)
	public List<Inquiry> findAllInquirys() {
		return inquiryRepository.findAll();
	}
	
	@Transactional(readOnly = true)
	public Inquiry findInquiryById(Integer inquiryNum) {
		return inquiryRepository.findById(inquiryNum).orElse(null);
	}
	
	@Transactional
	public void deleteInquiryById(Integer inquiryNum) {
		inquiryRepository.deleteById(inquiryNum);
	}
	public boolean existsByInquiryNum(Integer inquiryNum) {
		return inquiryRepository.existsById(inquiryNum);
	}

	public List<Inquiry> findInquiriesByUserId(String userId) {
		// TODO Auto-generated method stub
		return null;
	}
}
