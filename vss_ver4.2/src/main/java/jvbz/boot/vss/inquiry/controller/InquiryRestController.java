package jvbz.boot.vss.inquiry.controller;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.inject.Inject;
import jvbz.boot.vss.inquiry.entity.Inquiry;
import jvbz.boot.vss.inquiry.service.InquiryService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/inquiry")
public class InquiryRestController {
	
	private static final Logger logger = LogManager.getLogger(InquiryRestController.class);
	
	@Inject
	private final InquiryService inquiryService;
	
	@GetMapping("/selectAll")
	public List<Inquiry> getAllInquiry() {
		logger.info("조회");
		return inquiryService.findAllInquirys();
	}
	
	@GetMapping("/select/{inquiryNum}")
	public ResponseEntity<Inquiry> getInquiryById(@PathVariable("inquiryNum") Integer InquiryNum) {
		Inquiry inquiry = inquiryService.findInquiryById(InquiryNum);
		logger.info("inquiry", inquiry);
		if (inquiry != null) {
			return new ResponseEntity<>(inquiry, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(inquiry, HttpStatus.NOT_FOUND);
		}
	}
	
	@PostMapping("/insert")
	public ResponseEntity<String> createInquiry(@RequestBody Inquiry inquiry) {
		if (inquiryService.existsByInquiryNum(inquiry.getInquiryNum())) {
			return new ResponseEntity<>("문의 번호가 이미 존재합니다.", HttpStatus.BAD_REQUEST);
		}
		Inquiry inquiry2 = inquiryService.saveInquiry(inquiry);
		logger.info("inquiry", inquiry2);
		return new ResponseEntity<>("문의가 성공적으로 저장되었습니다.", HttpStatus.CREATED);
	}
	
	@PutMapping("/update/{inquiryNum}")
	public ResponseEntity<Inquiry> updateInquiry(@PathVariable("inquiryNum") Integer inquiryNum, @RequestBody Inquiry inquiryDetails) {
		Inquiry inquiry = inquiryService.findInquiryById(inquiryNum);
		if (inquiry != null) {
			inquiry.setInquiryTitle(inquiryDetails.getInquiryTitle());
			inquiry.setInquiryContent(inquiryDetails.getInquiryContent());
			Inquiry inquiry2 = inquiryService.saveInquiry(inquiry);
			return new ResponseEntity<>(inquiry2, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	@PutMapping("/reply/{inquiryNum}")
	public ResponseEntity<Inquiry> replyInquiry(@PathVariable("inquiryNum") Integer inquiryNum, @RequestBody Inquiry inquiryDetails) {
		Inquiry inquiry = inquiryService.findInquiryById(inquiryNum);
		if (inquiry != null) {
			inquiry.setInquiryAnswer(inquiryDetails.getInquiryAnswer());
			Inquiry inquiry2 = inquiryService.saveInquiry(inquiry);
			return new ResponseEntity<>(inquiry2, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	@DeleteMapping("/delete/{inquiryNum}")
	public ResponseEntity<HttpStatus> deleteInquiry(@PathVariable("inquiryNum") Integer inquiryNum) {
		inquiryService.deleteInquiryById(inquiryNum);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}
	
	@GetMapping("/selectByUser/{userId}")
	public ResponseEntity<List<Inquiry>> getInquiriesByUser(@PathVariable("userId") String userId) {
	    List<Inquiry> inquiries = inquiryService.findInquiriesByUserId(userId);
	    if (!inquiries.isEmpty()) {
	        return new ResponseEntity<>(inquiries, HttpStatus.OK);
	    } else {
	        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	    }
	}
}
